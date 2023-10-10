import type { CardState } from '$lib/components/PlayingCardThree/card';
import PlayingCardThree from '$lib/components/PlayingCardThree/playing-card-three.svelte';
import type { Deck } from '$lib/stores/cards';
import createCards from '$lib/stores/cards';
import { remove } from 'lodash-es';
export default class Game {
	private _flipped: CardState[] = [];
	public deck: Deck = [];
	public components: PlayingCardThree[] = [];
	public handleFlip = (e: CustomEvent<{ _id: number; _value?: number }>) => {
		if (!this.canFlip) return;
		console.log(`Flip on ${e.detail._id}`);
		this._flipped.push(this.deck[e.detail._id]);
	};
	public handleCover = (e: CustomEvent<{ _id: number; _value?: number }>) => {
		console.log(`Cover on ${e.detail._id}`);

		remove(this._flipped, (l) => l._id === e.detail._id);
	};
	constructor(private _maxFlipped: number = 2) {
		this.deck = createCards(10);
	}

	public canFlip() {
		return this._flipped.length === this._maxFlipped;
	}
	public get flipped() {
		return console.log(this._flipped);
	}
}
