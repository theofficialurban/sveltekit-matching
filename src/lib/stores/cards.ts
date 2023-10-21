import type PlayingCard from '$lib/types/Card';
import { writable, get, type Writable } from 'svelte/store';
import Face from '$lib/assets/card-face.png';
import { uniqueId, random, find, shuffle, sample, remove } from 'lodash-es';
import NotPictured from '$lib/assets/not-pictured.png';
import type GameManager from './manager';
type Card = PlayingCard['State'];
type Deck = PlayingCard['Deck'];
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
	public values: PlayingCard['Values'] = new Map([]);
	public pairs: PlayingCard['Pairs'] = new Map([]);
	/**
	 * @constructor
	 * @param count The number of cards to create in the deck / hand
	 * @param hasPairs Whether there should be pairs of cards.
	 * @param cardFaceImgs A container of images for the card faces, will be randomly assigned to the cards.
	 * @returns this
	 */
	constructor(
		private _manager: GameManager,
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
	public find(cardId: number): Promise<Card> {
		return new Promise<Card>((resolve, reject) => {
			let result: Card | undefined;
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
	 * @public newHand() - Resets the deck and deals a new hand.
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
	 * @public countCards(status)
	 * @param status - The status to count, returns # of face up or face down
	 * @returns the number of cards that are currently face up
	 */
	public countCards(status: PlayingCard['Status']): number {
		let count: number = 0;
		const deck: Deck = get(this.store);
		deck.forEach((card) => {
			if (card._status === status) count++;
		});
		return count;
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
									this.store.update((d) => {
										return shuffle(d);
									});
							  }
							: () => resolve(),
						500 * count
					);
				}
			});
		});
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
	 * @private _newCard() - Creates a single (or pair) of cards.
	 * @param pair True | False - Generate two instead of one card (pair)
	 * @returns PlayingCards[] - The cards that were created.
	 */
	private _newCard(pair: boolean = false): Card[] {
		const newCards: Card[] = [];
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
			_image: randomFace ?? NotPictured
		});
		// If pairs, add another new card with the same value
		if (pair === true) {
			// Get a new ID for the second card
			const pairId = parseInt(uniqueId());
			newCards.push({
				_id: pairId,
				_value: newVal,
				_status: 'FACEDOWN',
				_image: randomFace ?? NotPictured
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
	/**
	 * @public removeCards(...card Ids)
	 * @param args A list of card ids to remove.
	 * @returns Promise<void>
	 */
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
	/**
	 * @public setStatus(status, cardIds?)
	 * @param status The status to set the card(s) to
	 * @param args A list of card ids can be left blank to set status for all cards.
	 * @returns
	 */
	public setStatus(status: PlayingCard['Status'], ...args: number[]) {
		if (args.length === 0) {
			this.store.update((s) => {
				s.forEach((card) => (card._status = status));
				return s;
			});
		} else {
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
		return;
	}
}
