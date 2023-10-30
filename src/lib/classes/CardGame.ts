import Cover from '$lib/assets/card-cover.png';
import NotPictured from '$lib/assets/not-pictured.png';
import type BicycleCard from '$lib/types/BicycleCard';
import { isUndefined } from 'lodash-es';
import BicycleCardDeck from './Deck';
import type ICardGame from '$lib/types/CardGame';
import { writable, type Writable } from 'svelte/store';
import EventLogger from './EventLog';
import GameHandler from './GameHandler';
import InPlay from './InPlay';
import GameTimer from './GameTimer';
export enum Status {
	STOPPED,
	STARTED,
	COMPLETE
}
// Merge the options for all sub-classes to allow all options in this constructor.
type Options = Partial<ICardGame['OPTIONS'] & BicycleCard['Options']>;

type GameStore = { score: number; status: Status };
/**
 * @class CardGame
 * The helper class which brings all services together
 */
export default class CardGame {
	/**
	 * @public @instance
	 * deck - The deck / hand of cards
	 */
	deck: BicycleCardDeck;
	/**
	 * @public @store
	 * game - Store for the score and game status
	 */
	game: Writable<GameStore> = writable<GameStore>({ score: 0, status: Status.STOPPED });
	/**
	 * @public @logger
	 * eventLogger - Logs all game events
	 */
	eventLogger: EventLogger = new EventLogger(this);
	/**
	 * @public @handler
	 * GameHandler - Handles all game events.
	 */
	handler: GameHandler = new GameHandler(this);
	/**
	 * @public
	 * timer GameTimer
	 */
	timer: GameTimer = new GameTimer(this, { time: 60 });
	/**
	 * @public
	 * In Play - handles the card currently being played.
	 */
	inPlay: InPlay = new InPlay(this);
	/**
	 * @readonly @public adminControls - T/F for admin controls
	 */
	readonly adminControls: boolean = false;
	/**
	 * @private #_options
	 * count - Card Count
	 * pair - Generate each card a pair
	 * faceImages - Array of random face images
	 * cover - Cover of the card
	 */
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
			if (!isUndefined(options.timer) && !isUndefined(options.timer.time)) {
				this.timer = new GameTimer(this, { time: options.timer.time });
			}
		}

		// Create the new deck of cards.
		this.deck = new BicycleCardDeck(this);
		// Add some cards to the deck.
		this.deck.createCards(this.#_options.count, { pair: this.#_options.pair });
	}
	/**
	 * @public @method reset()
	 * Resets the following
	 * 1) Resets the deck and creates a new hand
	 * 2) Clears the "InPlay" set
	 * 3) Clears the event logger
	 * 4) Resets the score and game status
	 * 5) Resets the timer
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

			// Reset Event Log
			this.eventLogger.reset();
			this.game.set({ score: 0, status: Status.STOPPED });
			this.timer.reset();
			resolve();
		});
	};
	/**
	 * @public Sets Game Status T/F
	 */
	set gameStatus(s: Status) {
		this.game.update((g) => {
			g.status = s;
			return g;
		});
	}
}
