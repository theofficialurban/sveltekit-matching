import type BicycleCard from '$lib/types/BicycleCard';
import BicycleCardData from './Card';
import { uniqueId, random, isUndefined, sample } from 'lodash-es';
import NotPictured from '$lib/assets/not-pictured.png';
import Cover from '$lib/assets/card-cover.png';
export default class BicycleCardDeck extends Map<number, BicycleCardData> {
	pairs: Set<[number, number]> = new Set<[number, number]>();
	[Symbol.species]() {
		return Map<number, BicycleCardData>;
	}
	#_newId(): number {
		return parseInt(uniqueId());
	}
	#_newVal(): number {
		return random(0, 100, false);
	}
	reset() {
		this.pairs.clear();
		this.clear();
	}
	createCards(count: number = 1, options?: BicycleCard['Options']) {
		for (let index = 0; index < count; index++) {
			this.createCard(options);
		}
	}
	createCard(options?: BicycleCard['Options']): void {
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
	}
}
