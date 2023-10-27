import type BicycleCard from '$lib/types/BicycleCard';
import { Subject, Subscription } from 'rxjs';
import { includes } from 'lodash-es';
import BicycleCardDeck from './Deck';
import type { Rule } from './Rule';
import type ICardGame from '$lib/types/CardGame';
import gameUtils from '$lib/utilities/GameUtils';
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
	no_match: Symbol('GAME_NO_MATCH')
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
		if (includes(gameActions, status)) {
			console.log('Success');
		}
	}
	get utils() {
		return gameUtils;
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
