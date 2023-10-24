import type { EasingFunction } from 'svelte/transition';
import CardStore from './cards';
import GameVitals, { GameStatus, type CardLikeData } from './game';
import Timer from './timer';
import { Subject, interval, throttle } from 'rxjs';
import { get } from 'svelte/store';
type Settings = {
	playSize: number;
	controls: boolean;
	cards: {
		count: number;
		pairs: boolean;
		faceImgs?: string[];
	};
	timer: {
		duration: number;
		easing?: EasingFunction;
	};
};
export enum GameNotifs {
	START,
	STOP,
	SCORE,
	RESET,
	GAME_OVER,
	REMAINDER,
	FACEUP,
	FACEDOWN
}
type Notification = {
	status: GameNotifs;
	data?: {
		score?: number;
		remaining?: number;
		card?: CardLikeData;
		faceUpCt?: number;
	};
};
export default class GameManager {
	public hand: CardStore;
	public vitals: GameVitals;
	public timer: Timer;
	public unsubscribe: () => void;
	public notifications: Subject<Notification> = new Subject();
	static instance: GameManager | null = null;
	private constructor(public settings: Settings) {
		// Create the playing cards
		this.hand = new CardStore(
			this,
			this.settings.cards.count,
			this.settings.cards.pairs,
			this.settings.cards.faceImgs
		);
		// Create the game vitals
		this.vitals = new GameVitals(this);
		// Create the game timer
		this.timer = new Timer(this, this.settings.timer.duration, this.settings.timer.easing);

		// Set currently played to null.
		this.unsubscribe = this.#listen();
		return this;
	}
	#throttlePipe({ status }: Notification) {
		switch (status) {
			case GameNotifs.START:
				return interval(1000);
			case GameNotifs.SCORE:
				return interval(500);
			case GameNotifs.REMAINDER:
				return interval(500);
			case GameNotifs.GAME_OVER:
				return interval(1000);
			case GameNotifs.STOP:
				return interval(5000);
			case GameNotifs.RESET:
				return interval(2000);
			case GameNotifs.FACEUP:
				return Promise.resolve();
			default:
				return interval(1000);
		}
	}
	#listen() {
		const sub = this.notifications
			.pipe(throttle(this.#throttlePipe))
			.subscribe((n: Notification) => {
				switch (n.status) {
					case GameNotifs.START: {
						console.log('Game Begin');
						this.vitals.status = GameStatus.INPROGRESS;
						this.hand.shuffle(5).then(() => {
							this.timer.start();
						});
						break;
					}
					case GameNotifs.FACEUP: {
						const store = get(this.vitals.store);
						const count = store._faceUpCt;
						console.log(count);
						if (!count) return console.log('Return');
						if (count === this.settings.playSize) {
							this.vitals
								.gameResults()
								.then(() => {
									this.vitals.store.update((x) => ({ ...x, _faceUpCt: count - 2 }));
									this.notifications.next({ status: GameNotifs.SCORE });
								})
								.catch(() => {
									this.vitals.store.update((x) => ({ ...x, _faceUpCt: count - 2 }));
									setTimeout(() => this.vitals.clearPlay(), 1000);
								});
						}
						break;
					}
					case GameNotifs.REMAINDER: {
						if (n.data) {
							if (n.data.remaining && n.data.score) {
								const remainder = n.data.remaining;
								const score = n.data.score;
								if (remainder == 0 && score > 0) {
									this.vitals.status = GameStatus.ENDED;
								}
							}
						}
						console.log(n.data?.remaining);
						break;
					}
					case GameNotifs.SCORE: {
						console.log('Score');
						if (n.data !== undefined && n.data.remaining !== undefined) {
							if (n.data.remaining == 0) {
								return console.log('Game Over');
							}
						}
						this.vitals.scoreSuccess().catch((e) => console.error(e));
						return;
					}
					case GameNotifs.GAME_OVER: {
						this.vitals.status = GameStatus.ENDED;
						break;
					}
					case GameNotifs.RESET: {
						this.resetAll();
						this.vitals.status = GameStatus.NOTSTARTED;
					}
				}
			});
		return () => sub.unsubscribe();
	}
	resetAll(): Promise<void> {
		return new Promise<void>((resolve) => {
			this.hand.newHand();
			this.timer.reset();
			this.vitals.reset();
			resolve();
		});
	}
	static init(settings: Settings) {
		if (this.instance) return this.instance;
		this.instance = new GameManager(settings);
		return this.instance;
	}
}
