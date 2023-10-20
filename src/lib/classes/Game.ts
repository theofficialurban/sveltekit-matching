import type CardStore from '$lib/stores/cards';
import { Rule, type GameRule } from './Rule';
import PlayedCards, { type CardLikeData } from './Played';
import type PlayingCard from '$lib/types/Card';
import type { EasingFunction } from 'svelte/transition';
import { tweened, type Tweened } from 'svelte/motion';
import createEventCallback, { type Callback, type Handler } from './Builder';
import type { CardLike, CardMove } from '$lib/types/Card';
import { get } from 'svelte/store';

export interface GameSettings {
	playSize: number;
	controls: boolean;
	cardsPlayed: PlayedCards;
	gameStatus: GameStatus;
	score: number;
	gameRules: Rule[];
	hand: PlayingCard['Store'];
	timer: Tweened<number>;
	gameHandlers: {
		facedown: Handler<CardLike | CardMove>;
		faceup: Handler<CardLike | CardMove>;
		move: Handler<CardLike | CardMove>;
	};
}

type TimerOptions = {
	duration: number;
	easing: EasingFunction;
};
export enum GameStatus {
	WIN,
	ERROR,
	LOSS,
	INPROGRESS,
	NOTSTARTED,
	ENDED
}
function resolveStatus(status: GameStatus) {
	switch (status) {
		case 0:
			return 'Win';
		case 1:
			return 'Error';
		case 2:
			return 'Loss';
		case 3:
			return 'In Progress';
		case 4:
			return 'Not Started';
		case 5:
			return 'Ended';
	}
}
export default class Game implements GameSettings {
	public playSize: GameSettings['playSize'] = 2;
	public controls: GameSettings['controls'] = false;
	public timer: Tweened<number>;
	private _duration: number = 30;
	public score: number = 0;
	public cardsPlayed: PlayedCards;
	public gameRules: GameSettings['gameRules'] = [];
	public gameStatus: GameStatus = GameStatus.NOTSTARTED;
	public gameHandlers: GameSettings['gameHandlers'] = {
		facedown: () => console.log('Face Down'),
		faceup: () => console.log('Face Up'),
		move: () => console.log('Move')
	};

	constructor(public hand: CardStore, timerOptions: TimerOptions) {
		// Setup the timer
		this._duration = timerOptions.duration;
		this.timer = tweened(timerOptions.duration / 1000, {
			easing: timerOptions.easing,
			duration: timerOptions.duration
		});
		this.cardsPlayed = new PlayedCards(this);
		const myRule: GameRule = (game) => {
			return new Promise<boolean>((resolve, reject) => {
				const {
					cardsPlayed: { one, two }
				} = game;
				if (one && two) {
					return one._value === two._value ? resolve(true) : reject();
				}
			});
		};
		const testingRule: Rule = new Rule('Testing Rule', myRule);
		this.gameRules.push(testingRule);
		return this;
	}
	private _err(message: string) {
		throw new Error(message);
	}
	public gameResult(): Promise<{ one: CardLikeData; two: CardLikeData }> {
		return new Promise<{ one: CardLikeData; two: CardLikeData }>((resolve, reject) => {
			const rules: Rule[] = this.gameRules;
			const promises: Promise<void>[] = [];
			rules.forEach((rule) => promises.push(rule.attempt(this)));
			Promise.all(promises).then(
				() => {
					const { one, two } = this.cardsPlayed;
					resolve({ one, two });
				},
				() => reject('Rule(s) Failed')
			);
		});
	}
	get handlers() {
		return {
			game: {
				handleMove: this.gameHandlers.move,
				handleFaceDown: this.gameHandlers.facedown,
				handleFaceUp: this.gameHandlers.faceup
			}
		};
	}
	setHandler(type: keyof GameSettings['gameHandlers'], callback: Callback<CardLike | CardMove>) {
		switch (type) {
			case 'faceup': {
				this.gameHandlers.faceup = createEventCallback(this, callback);
				break;
			}
			case 'facedown': {
				this.gameHandlers.facedown = createEventCallback(this, callback);
				break;
			}
			case 'move': {
				this.gameHandlers.move = createEventCallback(this, callback);
				break;
			}
			default: {
				this._err('Error Setting Handler');
				break;
			}
		}
		return;
	}
	public startGame() {
		if (this.gameRules.length === 0) return this._err('No Game Rules.');
		this.gameStatus = GameStatus.INPROGRESS;
		this.timer.set(0).then(() => {
			this.gameStatus = GameStatus.ENDED;
		});
	}
	private reset() {
		this.timer.set(this._duration * 1000, { duration: 0 }).then(() => {
			this.gameStatus = GameStatus.NOTSTARTED;
		});
		this.cardsPlayed.reset(null);
		this.score = 0;
		this.hand.newHand();
	}
	public stopGame() {
		if (this.gameStatus !== GameStatus.INPROGRESS) return;
		const { score, timer } = this;
		const t = get(timer);
		timer.set(t, { duration: 0 });
		console.log('----RESULTS----');
		console.table([t, score]);
		this.reset();
	}
}
