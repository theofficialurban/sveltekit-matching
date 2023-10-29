import Cover from '$lib/assets/card-cover.png';
import { get, writable } from 'svelte/store';
import type BicycleCard from '$lib/types/BicycleCard';
import { uniqueId, remove } from 'lodash-es';
import type BicycleCardDeck from './Deck';
import type CardGame from './CardGame';
export default class BicycleCardData {
	readonly #_id: number;
	readonly #_value: number;
	readonly #_image: string;
	#_in_play: 'one' | 'two' | null = null;
	#_deck: BicycleCardDeck;
	store: BicycleCard['Store'];
	#_game: CardGame;
	constructor(_game: CardGame, _deck: BicycleCardDeck, data: BicycleCard['State']) {
		this.#_game = _game;
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
			this.#_in_play = null;

			return this.game.inPlay.clearPlay(this.#_in_play);
		}
		return false;
	};
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
	private get game() {
		return this.#_game;
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
	remove = () => {
		// First unplay card
		this.unPlayCard();
		this.#_removeCard();
	};
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
