import Cover from '$lib/assets/card-cover.png';
import { get, writable } from 'svelte/store';
import type BicycleCard from '$lib/types/BicycleCard';
import { uniqueId, remove } from 'lodash-es';
import type BicycleCardDeck from './Deck';

export default class BicycleCardData {
	readonly #_id: number;
	readonly #_value: number;
	readonly #_image: string;
	#_in_play: 1 | 2 | null = null;
	#_deck: BicycleCardDeck;
	store: BicycleCard['Store'];

	constructor(_deck: BicycleCardDeck, data: BicycleCard['State']) {
		this.#_deck = _deck;
		const { _id, _value, _image } = data;
		this.#_id = _id;
		this.#_value = _value;
		this.#_image = _image;
		this.store = writable<BicycleCard['State']>({ ...data });
		this.#_deck.addCard(this);
		return this;
	}
	get id() {
		return this.#_id;
	}
	get value() {
		return this.#_value;
	}
	get status() {
		const store = get(this.store);
		return store._status;
	}
	unPlayCard = () => {
		if (this.#_in_play) {
			this.game.clearPlay(this.#_in_play);
			return true;
		}
		return false;
	};
	playCard = () => {
		return new Promise<1 | 2>((resolve, reject) => {
			// Will return the slot or null if no play
			this.game
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
	private get game() {
		return this.#_deck.game;
	}
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
	setStatus = (_status: BicycleCard['Status']): Promise<void> => {
		return new Promise<void>((resolve) => {
			this.store.update((s) => {
				return { ...s, _status };
			});
			resolve();
		});
	};
	#_removeCard = () => {
		this.#_deck.getDeck().update((d) => {
			remove(d, (c) => {
				return c === this;
			});
			return d;
		});
	};
	cashScore = () => {
		// First unplay card
		this.unPlayCard();
		this.game.giveScore(1);
		this.#_removeCard();
		console.log('Card successfully cashed.');

		// Needs to give points then remove the card.
	};
	makePair = () => {
		const pairId = parseInt(uniqueId());
		new BicycleCardData(this.#_deck, {
			_id: pairId,
			_value: this.#_value,
			_status: 'FACEDOWN',
			_image: this.#_image,
			_cover: Cover
		});
		this.#_deck.pairs.add([this.#_id, pairId]);
	};
}
