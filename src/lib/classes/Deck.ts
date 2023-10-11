import type { CardState } from '$lib/components/PlayingCardThree/card';
import PlayingCardThree from '$lib/components/PlayingCardThree/playing-card-three.svelte';
import { shuffle } from 'lodash-es';
import { writable, type Writable } from 'svelte/store';

export class DeckTwo {
	private count: number = 5;
	private pairs: number = 0;
	public active: Writable<CardState[]> = writable<CardState[]>([]);
	public cards: Writable<CardState[]> = writable<CardState[]>([]);
	constructor(options: { count: number; pairs: number }) {
		this.count = options.count;
		this.pairs = options.pairs;
		for (let index = 0; index < options.count; index++) {
			const nc = this._createCard();
			if (nc) {
				this.cards.update((cards) => [...cards, nc]);
			}
		}
		return this;
	}
	private _createCard(): CardState | null {
		let nid = this._newId();
		while (this.find(nid) !== undefined) {
			nid = this._newId();
		}
		return { _id: nid, _value: this._randomValue() };
	}
	private _randomValue() {
		const nval = Math.ceil(Math.random() * 100);
		return nval;
	}
	private _newId = () => {
		const nid = Math.ceil(Math.random() * 100);
		return nid;
	};
	public find(cardId: number): CardState | undefined {
		let result;
		const unsubscriber = this.cards.subscribe((cards) => {
			if (cards.length > 0) {
				result = cards.find((c) => {
					return c._id == cardId;
				});
				return;
			}
		});
		unsubscriber();
		return result;
	}

	public shuffle() {
		this.cards.update((cards) => {
			return shuffle(cards);
		});
	}
}

export default class Deck {
	private count: number = 5;
	private pairs: number = 0;
	private handlers: (() => void)[] = [];
	public active: PlayingCardThree[] = [];
	public cards: PlayingCardThree[] = [];
	constructor(options: { count: number; pairs: number }) {
		this.count = options.count;
		this.pairs = options.pairs;
	}
	public find(cardId: number) {
		return this.cards.find((c) => c._id === cardId);
	}
	public exists(cardId: number) {
		const cds = this.cards.find((c) => c._id === cardId);
		return cds !== undefined;
	}
	private _newId = () => {
		const nid = Math.ceil(Math.random() * 100);
		return nid;
	};
	private _handleClick = (card: PlayingCardThree) => {
		if (card._status === 'FACEDOWN') {
			return (card._status = 'FACEUP');
		} else if (card._status === 'FACEUP') {
			return (card._status = 'FACEDOWN');
		}
	};
	public reset() {
		this.cards.forEach((c) => (c._status = 'FACEDOWN'));
	}
	private _createCard = (node: HTMLElement, value?: number) => {
		let newId = this._newId();
		while (this.exists(newId)) {
			console.error('Duplicate ID Trying Again');
			newId = this._newId();
		}
		const nc: PlayingCardThree = new PlayingCardThree({
			target: node,
			props: {
				_id: newId,
				_value: value ?? this._randomValue()
			}
		});
		this.handlers.push(nc.$on('click', () => this._handleClick(nc)));
		this.cards.push(nc);
	};
	private _randomValue() {
		const nval = Math.ceil(Math.random() * 100);
		return nval;
	}
	public deck(node: HTMLElement) {
		for (let index = 0; index < this.count; index++) {
			const nval = this._randomValue();
			for (let i = 0; i < this.pairs; i++) {
				this._createCard(node, nval);
			}
			this._createCard(node, nval);
		}
		return {
			destroy: () => {
				this.cards.forEach((c) => c.$destroy());
				this.handlers.forEach((c) => c());
			}
		};
	}
}
