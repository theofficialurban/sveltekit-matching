import type BicycleCard from '$lib/types/BicycleCard';
import { Subject, Subscription } from 'rxjs';
import { includes } from 'lodash-es';
import BicycleCardDeck from './Deck';
import type { Rule } from './Rule';
import type ICardGame from '$lib/types/CardGame';
import { get, writable } from 'svelte/store';
import { tweened } from 'svelte/motion';
import type BicycleCardData from './Card';
// Merge the options for all sub-classes to allow all options in this constructor.
type Options = Partial<ICardGame['OPTIONS'] & BicycleCard['Options']>;
/**
 * @constant gameActions
 * The symbols for the game actions.
 * Each symbol represents a specific action within the game,
 * this class will serve to process each of these symbolic actions internally.
 * i.e when a match is made, the subject will fire the GAME_MATCH symbol and process the logic.
 */
export const gameActions = {
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
	gameStore: ICardGame['GAME_STORE']['STORE'] = writable<ICardGame['GAME_STORE']['OBJECT']>({
		_in_play: { 1: null, 2: null },
		_score: 0,
		_timer: tweened(60, { duration: 60000 })
	});
	#_rules: Set<Rule> = new Set<Rule>();
	#_subject: Subject<ICardGame['GAMESUBJECT']> = new Subject<ICardGame['GAMESUBJECT']>();
	#_listener: Subscription | null = null;
	readonly adminControls: boolean = false;
	constructor(count: number = 1, options?: Options) {
		// Admin Controls
		this.adminControls = options?.adminControls ?? false;
		// Create the new deck of cards.
		this.deck = new BicycleCardDeck(this);
		// Add some cards to the deck.
		this.deck.createCards(count, options);
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
	makePlay = (card: BicycleCardData): 1 | 2 | null => {
		const currentStore = get(this.gameStore);
		const one = currentStore._in_play[1];
		const two = currentStore._in_play[2];
		if (!one) {
			this.gameStore.update((s) => {
				s._in_play[1] = card;
				return { ...s };
			});
			return 1;
		} else if (!two) {
			this.gameStore.update((s) => {
				s._in_play[2] = card;
				return { ...s };
			});
			return 2;
		}
		return null;
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
	#_processSubject({ status }: ICardGame['GAMESUBJECT']) {
		if (!includes(gameActions, status)) return;
		if (status === this.actions.match) console.log('match');
		if (status === this.actions.no_match) console.log('no match');
	}
	checkMatch = (): Promise<ICardGame['GAME_STORE']['IN_PLAY_OBJECT']> => {
		return new Promise<ICardGame['GAME_STORE']['IN_PLAY_OBJECT']>((resolve, reject) => {
			const gs = get(this.gameStore);
			const one = gs._in_play[1];
			const two = gs._in_play[2];
			if (one && two) {
				const fn = () => {
					Promise.all([this.deck.setStatus('FACEDOWN', one.id, two.id)]);
				};
				if (one.value === two.value) resolve({ 1: one, 2: two });
				fn();
			}
			reject();
		});
	};
	get inPlay() {
		const gs = get(this.gameStore);
		const one = gs._in_play[1];
		const two = gs._in_play[2];
		return {
			1: one,
			2: two
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
	get actions() {
		return gameActions;
	}
	/**
	 * @public reset()
	 * Resets the game, wipes the deck and unsubscribes from listener.
	 * @returns Promise<void>
	 */
	reset(): Promise<void> {
		return new Promise<void>((resolve) => {
			if (this.#_listener) {
				this.#_listener.unsubscribe();
			}
			this.deck.reset();
			resolve();
		});
	}
}
