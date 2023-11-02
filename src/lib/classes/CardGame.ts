import type BicycleCard from '$lib/types/BicycleCard';
import BicycleCardDeck from './Deck';
import type ICardGame from '$lib/types/CardGame';
import { writable, type Writable } from 'svelte/store';
import EventLogger from './EventLog';
import GameHandler from './GameHandler';
import InPlay from './InPlay';
import GameTimer from './GameTimer';
import type IGameHandler from '$lib/types/GameHandler';
import type Level from './Level';
export enum Status {
	STOPPED,
	STARTED,
	COMPLETE
}
// Merge the options for all sub-classes to allow all options in this constructor.
export type GameOptions = Partial<ICardGame['OPTIONS'] & BicycleCard['Options']>;
type GameStore = { score: number; status: Status; final: IGameHandler['SubjectData'] | null };
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
	game: Writable<GameStore> = writable<GameStore>({
		score: 0,
		status: Status.STOPPED,
		final: null
	});
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
	timer: GameTimer;
	/**
	 * @public
	 * In Play - handles the card currently being played.
	 */
	inPlay: InPlay = new InPlay(this);

	/**
	 * @private #_options
	 * count - Card Count
	 * pair - Generate each card a pair
	 * faceImages - Array of random face images
	 * cover - Cover of the card
	 */
	#_options;
	constructor(readonly level: Level) {
		// Create the new deck of cards.
		this.deck = new BicycleCardDeck(this);
		this.#_options = { ...level.cardOptions };
		this.timer = new GameTimer(this, level.timerOptions);
		// Add some cards to the deck.

		this.deck.createCards(level.cardOptions.count, level.cardOptions);
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
			console.log(this.#_options);
			this.deck.createCards(count, { pair, cover, faceImages });
			// Reset In Play
			this.inPlay.clearPlay();

			// Reset Event Log
			this.eventLogger.reset();
			this.game.set({ score: 0, status: Status.STOPPED, final: null });
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
	/**
	 * @public Sets final game statistics
	 */
	makeFinalStats = () => {
		this.game.update((g) => {
			g.final = this.handler.makeData();
			return g;
		});
	};
	/**
	 * Checks if admin controls are enabled.
	 * @returns T/F Admin controls enabled
	 */
	isAdmin = (): boolean => {
		return this.level.adminControls;
	};
}
