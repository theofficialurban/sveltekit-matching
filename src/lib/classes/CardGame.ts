import Cover from '$lib/assets/card-cover.png';
import NotPictured from '$lib/assets/not-pictured.png';
import type BicycleCard from '$lib/types/BicycleCard';
import { Subject, Subscription } from 'rxjs';
import { includes, isUndefined } from 'lodash-es';
import BicycleCardDeck from './Deck';
import type { Rule } from './Rule';
import type ICardGame from '$lib/types/CardGame';
import { get, writable } from 'svelte/store';
import { tweened } from 'svelte/motion';
import type BicycleCardData from './Card';
import type { EasingFunction } from 'svelte/transition';
import { linear } from 'svelte/easing';
// Merge the options for all sub-classes to allow all options in this constructor.
type Options = Partial<ICardGame['OPTIONS'] & BicycleCard['Options']>;
/**
 * @constant gameActions
 * The symbols for the game actions.
 * Each symbol represents a specific action within the game,
 * this class will serve to process each of these symbolic actions internally.
 * i.e when a match is made, the subject will fire the GAME_MATCH symbol and process the logic.
 */
export const gameActions: Record<ICardGame['ACTION_KEY'], symbol> = {
	start: Symbol('GAME_START'),
	end: Symbol('GAME_END'),
	match: Symbol('GAME_MATCH'),
	no_match: Symbol('GAME_NO_MATCH'),
	check_cards: Symbol('GAME_CHECK_CARDS')
};

/**
 * @class CardGame
 * @classdesc This is the top level class to manage the entirety of the game.
 * @property @public deck {BicycleCardDeck}
 * @property @private #_rules {Set<Rule>} - Game Rules
 * @property @subject @public play$ - RxJS Subject for game logic
 * @property @private #_listener - RxJS subscription.
 */
export default class CardGame {
	deck: BicycleCardDeck;
	gameStore: ICardGame['GAME_STORE']['STORE'] = writable<ICardGame['GAME_STORE']['OBJECT']>();
	eventLog: ICardGame['GAME_EVENT_LOG'] = writable<ICardGame['GAME_EVENT'][]>([]);
	#_rules: Set<Rule> = new Set<Rule>();
	#_cardsSettings: BicycleCard['Options'] = {
		count: 1,
		pair: false
	};
	#_subject: Subject<ICardGame['GAMESUBJECT']>;
	#_listener: Subscription | null = null;
	readonly adminControls: boolean = false;
	#_options = {
		timer: {
			time: 60,
			duration: 60000,
			easing: linear,
			delay: 0
		},
		count: 1,
		pair: false,
		faceImages: [NotPictured],
		cover: Cover
	};
	constructor(options?: Options) {
		if (!isUndefined(options)) {
			if (!isUndefined(options.timer)) {
				const time = !isUndefined(options.timer.time) ? options.timer.time : 60;
				const delay = !isUndefined(options.timer.delay) ? options.timer.delay : 0;
				const easing = !isUndefined(options.timer.easing) ? options.timer.easing : linear;
				this.#_options.timer = { time, duration: time * 1000, easing, delay };
				this.setTimer(time, delay, easing);
			}
			if (!isUndefined(options.count)) this.#_options.count = options.count;
			if (!isUndefined(options.pair)) this.#_options.pair = options.pair;
			if (!isUndefined(options.adminControls)) this.adminControls = options.adminControls;
			if (!isUndefined(options.cover)) this.#_options.cover = options.cover;
			if (!isUndefined(options.faceImages)) this.#_options.faceImages = options.faceImages;
		}
		// Setup Game Store
		this.#_resetGameStore();
		// Set new Subject
		this.#_subject = new Subject<ICardGame['GAMESUBJECT']>();

		// Create the new deck of cards.
		this.deck = new BicycleCardDeck(this);
		// Add some cards to the deck.
		this.deck.createCards(this.#_options.count, { pair: this.#_options.pair });
		// Begin listening to the Subject.
		this.#_listen();
	}
	/**
	 * @public play$ - A wrapper around the "next" method on the RxJS subject.
	 * @param nextValue - Equivilant to calling this.#_subject.next(nextValue)
	 * @returns void
	 */
	play$ = (nextValue: ICardGame['GAMESUBJECT']): void => {
		return this.#_subject.next(nextValue);
	};
	#_resetHandler() {
		this.#_subject.complete();
		this.#_subject = new Subject<ICardGame['GAMESUBJECT']>();
		this.#_listen();
	}
	#_logEvent = (type: ICardGame['ACTION_KEY'], data: ICardGame['GAMESUBJECT']['data']): boolean => {
		if (isUndefined(data)) return false;
		this.eventLog.update((l) => {
			l.push({ time: new Date().getTime(), data, type });
			return l;
		});
		return true;
	};
	makeSubjectData = (cardsOverwrite: ICardGame['GAME_STORE']['IN_PLAY_OBJECT'] | null = null) => {
		const store = this.currentStore;
		const data: ICardGame['GAMESUBJECT']['data'] = {
			_cards: cardsOverwrite ? cardsOverwrite : store._in_play,
			_cardsRemaining: this.deck.getDeckCounts().total,
			_currentTime: get(store._timer),
			_score: store._score
		};
		return data;
	};
	clearPlay = (slot: 1 | 2 | null): boolean => {
		switch (slot) {
			case 1: {
				this.gameStore.update((s) => {
					s._in_play[1] = null;
					return { ...s };
				});
				return true;
			}
			case 2: {
				this.gameStore.update((s) => {
					s._in_play[2] = null;
					return { ...s };
				});
				return true;
			}
			case null: {
				this.gameStore.update((s) => {
					s._in_play[1] = null;
					s._in_play[2] = null;
					return { ...s };
				});
				return true;
			}
			default: {
				return false;
			}
		}
	};
	setTimer = (time: number = 60, delay: number = 0, easing: EasingFunction = linear): void => {
		this.#_options.timer = { time, duration: time * 1000, delay, easing };
		this.resetTimer();
		return;
	};
	startTimer = () => {
		const {
			timer: { delay, duration, easing }
		} = this.#_options;
		return this.gameStore.update((s) => {
			s._timer.set(0, { duration, easing, delay }).then(() => {
				this.play$({ status: this.actions.end, data: this.makeSubjectData() });
			});
			return s;
		});
	};
	stopTimer = () => {
		return this.gameStore.update((s) => {
			s._timer.set(get(s._timer), { duration: 0 });
			return s;
		});
	};
	resetTimer = () => {
		return this.gameStore.update((s) => {
			s._timer.set(this.#_options.timer.time, { duration: 0 });
			return s;
		});
	};
	makePlay = (card: BicycleCardData): Promise<1 | 2> => {
		return new Promise<1 | 2>((resolve, reject) => {
			const currentStore = get(this.gameStore);
			const one = currentStore._in_play[1];
			const two = currentStore._in_play[2];
			if (!one) {
				this.gameStore.update((s) => {
					s._in_play[1] = card;
					return { ...s };
				});
				return resolve(1);
			} else if (!two) {
				this.gameStore.update((s) => {
					s._in_play[2] = card;
					return { ...s };
				});
				this.play$({
					status: this.actions.check_cards,
					data: this.makeSubjectData({ 1: one, 2: card })
				});
				return resolve(2);
			}
			return reject();
		});
	};
	/**
	 * @private #_listen
	 * Listens / Subscribes to the RxJS subject for game logic.
	 */
	#_listen(): void {
		this.#_listener = this.#_subject.subscribe((x) => {
			this.#_processSubject(x);
		});

		this.#_listener.add(() => console.log('Subject has been disposed of.'));
	}
	/**
	 * @private #_processSubject
	 * Processes logic from the listener
	 * @param {ICardGame['GAMESUBJECT']}
	 */
	#_processSubject({ status, data }: ICardGame['GAMESUBJECT']) {
		if (!includes(gameActions, status)) return;
		if (status === this.actions.match) {
			const one = data?._cards[1];
			const two = data?._cards[2];
			if (one && two) {
				one.cashScore();
				two.cashScore();
				this.#_logEvent('match', this.makeSubjectData({ 1: one, 2: two }));
			}
		}
		if (status === this.actions.no_match) {
			this.#_logEvent('no_match', this.makeSubjectData());
		}
		if (status === this.actions.end) console.log('Game Over!!!!', data);
		if (status === this.actions.check_cards) {
			this.checkMatch(data)
				.then((cards) => {
					// Give points etc
					if (cards[1] && cards[2]) {
						// Trigger a match call
						this.play$({ status: this.actions.match, data: this.makeSubjectData(cards) });
					}
				})
				.catch((e) => {
					this.play$({ status: this.actions.no_match, data: this.makeSubjectData() });
					console.error(e);
				});
		}
	}
	/**
	 * @method checkMatch()
	 * Checks to see if there was a successful match or not. Will reset the cards
	 * after a period of 2000ms for cosmetics.
	 * @param data The Data object from the RxJS subject <ICardGame['GAMESUBJECT']>
	 * @returns A promise resolved with the in-play object
	 * or rejected if no successful match.
	 */
	checkMatch = (
		data: ICardGame['GAMESUBJECT']['data']
	): Promise<ICardGame['GAME_STORE']['IN_PLAY_OBJECT']> => {
		return new Promise<ICardGame['GAME_STORE']['IN_PLAY_OBJECT']>((resolve, reject) => {
			if (isUndefined(data)) return reject();
			const { _cards } = data;
			const one = _cards[1];
			const two = _cards[2];
			if (one && two) {
				// Action function . resets cards and issues score.
				const fn = () => {
					Promise.all([this.deck.setStatus('FACEDOWN', one.id, two.id)]);
					if (one.value === two.value) {
						console.log('Successful Match!');
						return resolve(_cards);
					} else {
						return reject('Un-Successful Match!');
					}
				};

				setTimeout(fn, 2000);
			}
		});
	};
	get inPlay() {
		const gs = get(this.gameStore);
		const one = gs._in_play[1];
		const two = gs._in_play[2];
		return {
			one,
			two
		};
	}
	get inPlayCount() {
		let ipc = 0;
		const gs = get(this.gameStore);
		const one = gs._in_play[1];
		const two = gs._in_play[2];
		if (one) ipc++;
		if (two) ipc++;
		return ipc;
	}
	private get currentStore() {
		return get(this.gameStore);
	}
	get gameStatus() {
		return this.currentStore._active;
	}
	get actions() {
		return gameActions;
	}
	#_resetGameStore() {
		const {
			timer: { time, delay, duration, easing }
		} = this.#_options;
		this.gameStore.set({
			_in_play: { 1: null, 2: null },
			_score: 0,
			_timer: tweened(time, {
				duration,
				delay,
				easing
			}),
			_active: false
		});
	}
	/**
	 * @public reset()
	 * Resets the game, wipes the deck and unsubscribes from listener.
	 * @returns Promise<void>
	 */
	reset = (): Promise<void> => {
		return new Promise<void>((resolve) => {
			// Complete and unsubscribe from the listener
			if (this.#_listener) {
				this.#_listener.unsubscribe();
				this.#_resetHandler();
			}
			// Reset Deck
			this.deck.reset();
			// Create a new deck
			const { pair, count, cover, faceImages } = this.#_options;
			this.deck.createCards(count, { pair, cover, faceImages });
			// Reset Game Store
			this.#_resetGameStore();
			// Reset Rules
			this.#_rules.clear();
			// Reset Timer
			this.resetTimer();
			// Reset Event Log
			this.eventLog.set([]);

			resolve();
		});
	};
	giveScore = (addScore: number = 1): void => {
		this.gameStore.update((s) => {
			s._score += addScore;
			return s;
		});
	};
}
