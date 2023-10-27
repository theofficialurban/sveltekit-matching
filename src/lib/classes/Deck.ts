import type BicycleCard from '$lib/types/BicycleCard';
import BicycleCardData from './Card';
import { uniqueId, random, isUndefined, sample, shuffle } from 'lodash-es';
import NotPictured from '$lib/assets/not-pictured.png';
import Cover from '$lib/assets/card-cover.png';
import { get, writable, type Writable } from 'svelte/store';
export default class BicycleCardDeck {
	pairs: Set<[number, number]> = new Set<[number, number]>();
	#_deck: Writable<BicycleCardData[]> = writable<BicycleCardData[]>([]);
	constructor() {}

	#_newId(): number {
		return parseInt(uniqueId());
	}
	#_newVal(): number {
		return random(0, 100, false);
	}
	reset = (): void => {
		this.#_deck.set([]);
		this.pairs.clear();
	};
	addCard = (card: BicycleCardData): void => {
		return this.#_deck.update((d) => {
			return [...d, card];
		});
	};
	getDeck = (): BicycleCard['DeckStore'] => {
		return this.#_deck;
	};

	getCardById = (cardId: number): BicycleCardData | null => {
		const deck = get(this.#_deck);
		const result = deck.find((c) => c.id == cardId);
		if (isUndefined(result)) return null;
		return result;
	};
	getDeckCounts = () => {
		let faceup = 0;
		let facedown = 0;
		let total = 0;
		const deck = get(this.#_deck);
		deck.forEach((c) => {
			if (c.status === 'FACEDOWN') facedown += 1;
			if (c.status === 'FACEUP') faceup += 1;
			total += 1;
		});
		return {
			faceup,
			facedown,
			total,
			allFaceUp: faceup === total ? true : false,
			allFaceDown: facedown === total ? true : false
		};
	};
	shuffle = (repeat: number = 1): Promise<void> => {
		return this.setStatus('FACEDOWN').then(() => {
			const _shuffle = () => {
				this.#_deck.update((d) => {
					return shuffle(d);
				});
			};
			for (let index = 0; index < repeat; index++) {
				setTimeout(_shuffle, 250 * index);
			}
		});
	};
	setStatus = (status: BicycleCard['Status'], ...args: number[]): Promise<void> => {
		if (status === 'FACEDOWN' && this.getDeckCounts().allFaceDown) return Promise.resolve();
		if (status === 'FACEUP' && this.getDeckCounts().allFaceUp) return Promise.resolve();
		return new Promise<void>((resolve) => {
			this.#_deck.update((d) => {
				// If no args set all card status.
				if (!args || args.length === 0) {
					d.forEach((c) => {
						c.setStatus(status);
					});
					setTimeout(() => resolve(), 1500);
					return d;
				} else {
					// If given Ids, for every id, find card
					// if found, set status.

					args.forEach((id) => {
						const card = this.getCardById(id);
						console.log(card);
						if (card) {
							card.setStatus(status);
						}
					});
					setTimeout(() => resolve(), 1500);
					return d;
				}
			});
		});
	};
	createCard = (options?: BicycleCard['Options']): void => {
		let coverImg: string = Cover;
		let faceImgs: string[] = [NotPictured];
		if (!isUndefined(options)) {
			const { faceImages, cover } = options;
			if (!isUndefined(faceImages)) faceImgs = faceImages;
			if (!isUndefined(cover)) coverImg = cover;
		}
		const _id = this.#_newId();
		const _value = this.#_newVal();
		const state: BicycleCard['State'] = {
			_id,
			_value,
			_status: 'FACEDOWN',
			_image: sample(faceImgs) ?? NotPictured,
			_cover: coverImg
		};
		const newCard = new BicycleCardData(this, state);
		if (!isUndefined(options) && !isUndefined(options.pair)) {
			if (options.pair === true) {
				newCard.makePair();
			}
		}
	};
	createCards = (count: number = 1, options?: BicycleCard['Options']) => {
		for (let index = 0; index < count; index++) {
			this.createCard(options);
		}
	};
}
