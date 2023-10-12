import type { CardState } from '$lib/components/PlayingCardThree/card';
import { writable, type Writable, get } from 'svelte/store';
import Face from '$lib/assets/card-face.png';
import { uniqueId, random, find, shuffle, sample } from 'lodash-es';
type Deck = CardState[];
type Values = Map<number, number>;
type Pairs = Map<number, [number, number]>; // Value => [card 1 id, card 2 id]

export default class CardStore {
	public store: Writable<Deck> = writable<Deck>([]);
	public values: Values = new Map([]);
	public pairs: Pairs = new Map([]);
	constructor(
		public count: number = 5,
		public hasPairs: boolean = false,
		private cardFaceImgs: string[] = [Face]
	) {
		this.#createDeck(this.count, this.hasPairs);
		return this;
	}
	public find(cardId: number) {
		return new Promise<CardState>((resolve, reject) => {
			let result: CardState | undefined;
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
	public reset() {
		return new Promise<void>((resolve) => {
			this.store.set([]);
			this.values.clear();
			this.pairs.clear();
			resolve();
		});
	}
	public async newHand() {
		this.reset();
		return this.#createDeck(this.count, this.hasPairs);
	}
	public revealAll() {
		return this.store.update((deck) => {
			deck.forEach((c) => {
				c._status = 'FACEUP';
			});
			return deck;
		});
	}
	public coverAll(delay: number = 100): Promise<void> {
		if (this.isCovered()) return Promise.resolve();
		return new Promise<void>((resolve) => {
			this.store.update((deck) => {
				deck.forEach((card) => (card._status = 'FACEDOWN'));
				return deck;
			});
			setTimeout(() => resolve(), delay);
		});
	}
	isCovered(): boolean {
		let faceUp = 0;
		const deck: Deck = get(this.store);
		deck.forEach((card) => {
			if (card._status === 'FACEUP') faceUp++;
		});
		if (faceUp !== 0) return false;
		return true;
	}
	#shuffle() {
		this.store.update((d) => {
			return shuffle(d);
		});
	}
	shuffle(repeat: number = 1, delay: number = 1000) {
		this.coverAll(delay).then(() => {
			let count = 0;
			while (count < repeat) {
				setTimeout(() => this.#shuffle(), count * 500);
				count++;
			}
		});
	}

	#createDeck(count: number, pairs: boolean) {
		for (let index = 0; index < count; index++) {
			this.#newCard(pairs);
		}
		return;
	}
	#valueExists(val: number): boolean {
		const result = find(this.values, (v) => v === val);
		if (result !== undefined) return true;
		if (result === undefined) return false;
		return false;
	}
	#newCard(pair: boolean = false): CardState[] {
		const newCards: CardState[] = [];
		// Create a unique ID and a unique new value
		const newId: number = parseInt(uniqueId());
		let newVal: number = random(0, 100, false);
		const randomFace = sample(this.cardFaceImgs);
		while (this.#valueExists(newVal)) {
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
}
