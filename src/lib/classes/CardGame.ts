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
import GameTimer from './GameTimer';
// Merge the options for all sub-classes to allow all options in this constructor.
type Options = Partial<ICardGame['OPTIONS'] & BicycleCard['Options']>;

type GameStore = { score: number; status: boolean };
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
	game: Writable<GameStore> = writable<GameStore>({ score: 0, status: false });
	eventLogger: EventLogger = new EventLogger(this);
	handler: GameHandler = new GameHandler(this);
	timer: GameTimer = new GameTimer(this, { time: 30 });
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
			this.game.set({ score: 0, status: false });
			this.timer.reset();
			resolve();
		});
	};
	set gameStatus(s: boolean) {
		this.game.update((g) => {
			g.status = s;
			return g;
		});
	}
}
