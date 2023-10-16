import type { PlayingCard, Status } from '$lib/components/PlayingCard/card';
import { writable, type Writable, get } from 'svelte/store';
import Face from '$lib/assets/card-face.png';
import { uniqueId, random, find, shuffle, sample, remove } from 'lodash-es';
/* A deck of playing cards */
export type Deck = PlayingCard[];
/* A map of card values where Card ID -> Card Value */
type Values = Map<number, number>;
/* A map of pairs where Value -> pairs [c1, c2] where c1 and c2 share the value */
type Pairs = Map<number, [number, number]>;

/**
 * @class CardStore
 * @classdesc The store of cards, a deck. Inclues helper methods and functions for interacting with the
 * store and the cards.
 * @property @public store - The Svelte Store holding the cards in a hand.
 * @property @public values - A map of card values where Card ID -> Card Value
 * @property @public pairs - A map of pairs where Value -> pairs [c1, c2] where c1 and c2 share the value
 */
export default class CardStore {
	public store: Writable<Deck> = writable<Deck>([]);
	public values: Values = new Map([]);
	public pairs: Pairs = new Map([]);
	/**
	 * @constructor
	 * @param count The number of cards to create in the deck / hand
	 * @param hasPairs Whether there should be pairs of cards.
	 * @param cardFaceImgs A container of images for the card faces, will be randomly assigned to the cards.
	 * @returns this
	 */
	constructor(
		public count: number = 5,
		public hasPairs: boolean = false,
		private cardFaceImgs: string[] = [Face]
	) {
		this._createDeck(this.count, this.hasPairs);
		return this;
	}
	/**
	 * @public find - Finds a card in the deck
	 * @param cardId The id of the card to find in the deck
	 * @returns Promise<PlayingCard>
	 */
	public find(cardId: number): Promise<PlayingCard> {
		return new Promise<PlayingCard>((resolve, reject) => {
			let result: PlayingCard | undefined;
			const unsubscriber = this.store.subscribe((deck) => {
				result = deck.find((c) => c._id == cardId);
			});
			if (result === undefined) {
				unsubscriber();
				reject('No Results');
			}
			if (result !== undefined) {
				unsubscriber();
				resolve(result);
			}
		});
	}
	/**
	 * @private reset() - Resets the deck clearing all stores.
	 * @returns Promise<void>
	 */
	private reset() {
		return new Promise<void>((resolve) => {
			this.store.set([]);
			this.values.clear();
			this.pairs.clear();
			resolve();
		});
	}
	/**
	 * @public @async newHand() - Resets the deck and deals a new hand.
	 * @returns void
	 */
	public newHand() {
		this.reset();
		return this._createDeck(this.count, this.hasPairs);
	}
	/**
	 * @public revealAll() - Reveals (faceup) all cards
	 * @returns void
	 */
	public revealAll() {
		return this.store.update((deck) => {
			deck.forEach((c) => {
				c._status = 'FACEUP';
			});
			return deck;
		});
	}
	/**
	 * @public coverAll() - Covers all cards (facedown)
	 * @returns Promise<void>
	 */
	public coverAll(): Promise<void> {
		if (this.isCovered()) return Promise.resolve();
		return new Promise<void>((resolve) => {
			this.store.update((deck) => {
				deck.forEach((card) => (card._status = 'FACEDOWN'));
				return deck;
			});
			setTimeout(() => resolve(), 1000);
		});
	}
	/**
	 * @public isCovered() - Checks whether all cards are covered
	 * @returns boolean
	 */
	public isCovered(): boolean {
		let faceUp = 0;
		const deck: Deck = get(this.store);
		deck.forEach((card) => {
			if (card._status === 'FACEUP') faceUp++;
		});
		if (faceUp !== 0) return false;
		return true;
	}
	/**
	 * @public countFaceUp()
	 * @returns the number of cards that are currently face up
	 */
	public countFaceUp(): number {
		let faceUp: number = 0;
		const deck: Deck = get(this.store);
		deck.forEach((card) => {
			if (card._status === 'FACEUP') faceUp++;
		});
		return faceUp;
	}
	/**
	 * @private _shuffle() - Internal helper which shuffles all cards.
	 */
	private _shuffle() {
		this.store.update((d) => {
			return shuffle(d);
		});
	}
	/**
	 * @public shuffle(repeat = 1) Shuffles all cards. Public Method
	 * @param repeat Number of times to shuffle
	 * @returns Promise to be resolved when all are completed
	 */
	public shuffle(repeat: number = 1) {
		return new Promise<void>((resolve) => {
			this.coverAll().then(() => {
				let count = 0;
				while (count <= repeat) {
					count++;
					setTimeout(
						count <= repeat
							? () => {
									this._shuffle();
							  }
							: () => resolve(),
						500 * count
					);
				}
			});
		});
	}
	/**
	 * @private createDeck(count, pairs) - Creates a new deck
	 * @param count The number of cards to create.
	 * @param pairs True | False - Generate pairs or not
	 * @returns void
	 */
	private _createDeck(count: number, pairs: boolean) {
		for (let index = 0; index < count; index++) {
			this._newCard(pairs);
		}
		return;
	}
	/**
	 * @private _valueExists(value) - Check to see if a card value is in use
	 * @param val The card value to check for
	 * @returns boolean
	 */
	private _valueExists(val: number): boolean {
		const result = find(this.values, (v) => v === val);
		if (result !== undefined) return true;
		if (result === undefined) return false;
		return false;
	}
	/**
	 * @private _newCard() - Creates a single (or pair) of cards.
	 * @param pair True | False - Generate two instead of one card (pair)
	 * @returns PlayingCards[] - The cards that were created.
	 */
	private _newCard(pair: boolean = false): PlayingCard[] {
		const newCards: PlayingCard[] = [];
		// Create a unique ID and a unique new value
		const newId: number = parseInt(uniqueId());
		let newVal: number = random(0, 100, false);
		const randomFace = sample(this.cardFaceImgs);
		while (this._valueExists(newVal)) {
			newVal = random(0, 100, false);
		}
		// Create a new card object, if pairs is true, create a pair
		newCards.push({
			_id: newId,
			_value: newVal,
			_status: 'FACEDOWN',
			_image: randomFace
		});
		// If pairs, add another new card with the same value
		if (pair === true) {
			// Get a new ID for the second card
			const pairId = parseInt(uniqueId());
			newCards.push({
				_id: pairId,
				_value: newVal,
				_status: 'FACEDOWN',
				_image: randomFace
			});
			// Add the pair into the pairs object where - Some Value => [card id 1, card id 2]
			this.pairs.set(newVal, [newId, pairId]);
			// Add the card value to the values object where - Card ID => Card Value
			this.values.set(pairId, newVal);
		}
		this.values.set(newId, newVal);
		this.store.update((s) => [...s, ...newCards]);
		return newCards;
	}
	public removeCards(...args: number[]): Promise<void> {
		return new Promise<void>((resolve) => {
			this.store.update((s) => {
				remove(s, (card) => {
					return args.includes(card._id);
				});
				return s;
			});
			resolve();
		});
	}
	public setStatus(status: Status, ...args: number[]) {
		args.forEach((i) => {
			this.store.update((s) => {
				s.forEach((c) => {
					if (c._id === i) c._status = status;
					return;
				});
				return s;
			});
		});
	}
}
