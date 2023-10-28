import Cover from '$lib/assets/card-cover.png';
import NotPictured from '$lib/assets/not-pictured.png';
import type BicycleCard from '$lib/types/BicycleCard';

import { isUndefined } from 'lodash-es';
import BicycleCardDeck from './Deck';
import type { Rule } from './Rule';
import type ICardGame from '$lib/types/CardGame';
import { writable, type Writable } from 'svelte/store';
import EventLogger from './EventLog';
import GameHandler from './GameHandler';
import InPlay from './InPlay';
// Merge the options for all sub-classes to allow all options in this constructor.
type Options = Partial<ICardGame['OPTIONS'] & BicycleCard['Options']>;

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
	score: Writable<number> = writable<number>(0);
	eventLogger: EventLogger = new EventLogger(this);
	handler: GameHandler = new GameHandler(this);
	#_rules: Set<Rule> = new Set<Rule>();
	inPlay: InPlay = new InPlay(this);
	readonly adminControls: boolean = false;
	#_options = {
		count: 1,
		pair: false,
		faceImages: [NotPictured],
		cover: Cover
	};
	constructor(options?: Options) {
		if (!isUndefined(options)) {
			if (!isUndefined(options.count)) this.#_options.count = options.count;
			if (!isUndefined(options.pair)) this.#_options.pair = options.pair;
			if (!isUndefined(options.adminControls)) this.adminControls = options.adminControls;
			if (!isUndefined(options.cover)) this.#_options.cover = options.cover;
			if (!isUndefined(options.faceImages)) this.#_options.faceImages = options.faceImages;
		}
		// Create the new deck of cards.
		this.deck = new BicycleCardDeck(this);
		// Add some cards to the deck.
		this.deck.createCards(this.#_options.count, { pair: this.#_options.pair });
		// Begin listening to the Subject.
	}

	// makeSubjectData = (cardsOverwrite: ICardGame['GAME_STORE']['IN_PLAY_OBJECT'] | null = null) => {
	// 	const store = this.currentStore;
	// 	const data: ICardGame['GAMESUBJECT']['data'] = {
	// 		_cards: cardsOverwrite ? cardsOverwrite : store._in_play,
	// 		_cardsRemaining: this.deck.getDeckCounts().total,
	// 		_currentTime: get(store._timer),
	// 		_score: store._score
	// 	};
	// 	return data;
	// };
	/**
	 * @private #_processSubject
	 * Processes logic from the listener
	 * @param {ICardGame['GAMESUBJECT']}
	 */
	// #_processSubject({ status, data }: ICardGame['GAMESUBJECT']) {
	// 	if (!includes(gameActions, status)) return;
	// 	if (status === this.actions.match) {
	// 		const one = data?._cards[1];
	// 		const two = data?._cards[2];
	// 		if (one && two) {
	// 			one.cashScore();
	// 			two.cashScore();
	// 			this.eventLogger.logEvent('match', this.makeSubjectData({ 1: one, 2: two }));
	// 		}
	// 	}
	// 	if (status === this.actions.no_match) {
	// 		this.eventLogger.logEvent('no_match', this.makeSubjectData());
	// 	}
	// 	if (status === this.actions.end) console.log('Game Over!!!!', data);
	// 	if (status === this.actions.check_cards) {
	// 		this.checkMatch(data)
	// 			.then((cards) => {
	// 				// Give points etc
	// 				if (cards[1] && cards[2]) {
	// 					// Trigger a match call
	// 					this.play$({ status: this.actions.match, data: this.makeSubjectData(cards) });
	// 				}
	// 			})
	// 			.catch((e) => {
	// 				this.play$({ status: this.actions.no_match, data: this.makeSubjectData() });
	// 				console.error(e);
	// 			});
	// 	}
	// }
	/**
	 * @method checkMatch()
	 * Checks to see if there was a successful match or not. Will reset the cards
	 * after a period of 2000ms for cosmetics.
	 * @param data The Data object from the RxJS subject <ICardGame['GAMESUBJECT']>
	 * @returns A promise resolved with the in-play object
	 * or rejected if no successful match.
	 */
	// checkMatch = (
	// 	data: ICardGame['GAMESUBJECT']['data']
	// ): Promise<ICardGame['GAME_STORE']['IN_PLAY_OBJECT']> => {
	// 	return new Promise<ICardGame['GAME_STORE']['IN_PLAY_OBJECT']>((resolve, reject) => {
	// 		if (isUndefined(data)) return reject();
	// 		const { _cards } = data;
	// 		const one = _cards[1];
	// 		const two = _cards[2];
	// 		if (one && two) {
	// 			// Action function . resets cards and issues score.
	// 			const fn = () => {
	// 				Promise.all([this.deck.setStatus('FACEDOWN', one.id, two.id)]);
	// 				if (one.value === two.value) {
	// 					console.log('Successful Match!');
	// 					return resolve(_cards);
	// 				} else {
	// 					return reject('Un-Successful Match!');
	// 				}
	// 			};

	// 			setTimeout(fn, 2000);
	// 		}
	// 	});
	// };

	/**
	 * @public reset()
	 * Resets the game, wipes the deck and unsubscribes from listener.
	 * @returns Promise<void>
	 */
	reset = (): Promise<void> => {
		return new Promise<void>((resolve) => {
			// Reset Deck
			this.deck.reset();
			// Create a new deck
			const { pair, count, cover, faceImages } = this.#_options;
			this.deck.createCards(count, { pair, cover, faceImages });
			// Reset In Play
			this.inPlay.clearPlay();
			// Reset Rules
			this.#_rules.clear();
			// Reset Event Log
			this.eventLogger.reset();
			this.score.set(0);

			resolve();
		});
	};
}
