import Cover from '$lib/assets/card-cover.png';
import { writable } from 'svelte/store';
import type BicycleCard from '$lib/types/BicycleCard';
import { uniqueId } from 'lodash-es';
export default class BicycleCardData {
	readonly #_id: number;
	readonly #_value: number;
	readonly #_image: string;
	#_deck: BicycleCard['Deck'];
	store: BicycleCard['Store'];

	constructor(_deck: BicycleCard['Deck'], data: BicycleCard['State']) {
		this.#_deck = _deck;
		const { _id, _value, _image } = data;
		this.#_id = _id;
		this.#_value = _value;
		this.#_image = _image;
		this.store = writable<BicycleCard['State']>({ ...data });
		this.#_deck.set(this.#_id, this);
		return this;
	}
	get id() {
		return this.#_id;
	}
	get value() {
		return this.#_value;
	}
	flip() {
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
	}
	makePair() {
		const pairId = parseInt(uniqueId());
		new BicycleCardData(this.#_deck, {
			_id: pairId,
			_value: this.#_value,
			_status: 'FACEDOWN',
			_image: this.#_image,
			_cover: Cover
		});
		this.#_deck.pairs.add([this.#_id, pairId]);
	}
}
