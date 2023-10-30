import Cover from '$lib/assets/card-cover.png';
import { get, writable } from 'svelte/store';
import type BicycleCard from '$lib/types/BicycleCard';
import { uniqueId, remove } from 'lodash-es';
import type BicycleCardDeck from './Deck';
import type CardGame from './CardGame';
/**
 * @class BicycleCardData
 * Holds store and data for a single playing card.
 */
export default class BicycleCardData {
	/**
	 * @readonly @private #_id
	 * The card ID
	 */
	readonly #_id: number;
	/**
	 * @readonly @private #_value
	 * The card value
	 */
	readonly #_value: number;
	/**
	 * @readonly @private #_image
	 * The face image of the card
	 */
	readonly #_image: string;
	/**
	 * @private #_in_play
	 * The slot of play the card is in, null if none.
	 */
	#_in_play: 'one' | 'two' | null = null;
	/**
	 * @private #_deck
	 * The deck this card belongs to
	 * @instance BicycleCardDeck
	 */
	#_deck: BicycleCardDeck;
	/**
	 * @public store
	 * The card data store or state
	 */
	store: BicycleCard['Store'];
	/**
	 * @private #_game
	 * The game this card belongs to.
	 * @instance CardGame
	 */
	#_game: CardGame;
	// This class does not create the cards, the data is created by the deck.
	constructor(_game: CardGame, _deck: BicycleCardDeck, data: BicycleCard['State']) {
		this.#_game = _game;
		this.#_deck = _deck;
		// Grab the passed in data and set it.
		const { _id, _value, _image } = data;
		this.#_id = _id;
		this.#_value = _value;
		this.#_image = _image;
		// Create the store with the data.
		this.store = writable<BicycleCard['State']>({ ...data });
		// Then add the card to the deck.
		this.#_deck.addCard(this);
		return this;
	}
	/**
	 * Gets the ID
	 */
	get id() {
		return this.#_id;
	}
	/**
	 * Gets the value
	 */
	get value() {
		return this.#_value;
	}
	/**
	 * Gets the status
	 */
	get status() {
		const store = get(this.store);
		return store._status;
	}
	/**
	 * @public @method unPlayCard()
	 * Un-plays the card if played.
	 * @returns T/F
	 */
	unPlayCard = () => {
		if (this.#_in_play) {
			this.#_in_play = null;

			return this.game.inPlay.clearPlay(this.#_in_play);
		}
		return false;
	};
	/**
	 * @public @method playCard()
	 * Plays the card when flipped over (1/2)
	 * @returns Promise resolving to one | two (slot of play)
	 */
	playCard = () => {
		return new Promise<'one' | 'two'>((resolve, reject) => {
			// Will return the slot or null if no play
			this.#_game.inPlay
				.makePlay(this)
				.then((slot) => {
					this.#_in_play = slot;
					resolve(slot);
				})
				.catch(() => {
					console.error('Could not play card');
					reject();
				});
		});
	};
	/**
	 * @private
	 * Gets the game instance
	 * @returns @instance CardGame
	 */
	private get game() {
		return this.#_game;
	}
	/**
	 * @public @method flip()
	 * Flips the card
	 * @returns void
	 */
	flip = () => {
		return this.store.update((c) => {
			const current = c._status;
			switch (current) {
				case 'FACEDOWN': {
					return { ...c, _status: 'FACEUP' };
				}
				case 'FACEUP': {
					return { ...c, _status: 'FACEDOWN' };
				}
			}
		});
	};
	/**
	 * @public @method setStatus()
	 * Sets the card status
	 * @param _status The status to set the card
	 * @returns Promise<void>
	 */
	setStatus = (_status: BicycleCard['Status']): Promise<void> => {
		return new Promise<void>((resolve) => {
			this.store.update((s) => {
				return { ...s, _status };
			});
			resolve();
		});
	};
	/**
	 * @private @method #_removeCard()
	 * Removes the card completely from the deck.
	 */
	#_removeCard = () => {
		this.#_deck.getDeck().update((d) => {
			remove(d, (c) => {
				return c === this;
			});
			return d;
		});
	};
	/**
	 * @public @method remove()
	 * Public facing method to remove the card.
	 */
	remove = () => {
		// First unplay card
		this.unPlayCard();
		this.#_removeCard();
	};
	/**
	 * @public @method makePair()
	 * Creates a pair for the card.
	 * Pair has same value but unique ID
	 */
	makePair = () => {
		const pairId = parseInt(uniqueId());
		new BicycleCardData(this.#_game, this.#_deck, {
			_id: pairId,
			_value: this.#_value,
			_status: 'FACEDOWN',
			_image: this.#_image,
			_cover: Cover
		});
		this.#_deck.pairs.add([this.#_id, pairId]);
	};
}
