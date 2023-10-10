import PlayingCardThree from '$lib/components/PlayingCardThree/playing-card-three.svelte';
import { remove } from 'lodash-es';
import type { SvelteComponent } from 'svelte';

interface CardGame<C extends SvelteComponent> {
	cards: C[];
	flippedCards: C[];
}
type InitOptions = {
	count: number;
	valueFn?: (index: number) => number;
};
export default class Game implements CardGame<PlayingCardThree> {
	public flippedCards: PlayingCardThree[] = [];
	public cards: PlayingCardThree[] = [];
	private _cleanupEvents: (() => void)[] = [];
	constructor() {}
	private hasWon() {
		if (this.flippedCards.length !== 2) return false;
		const c1 = this.flippedCards[0];
		const c2 = this.flippedCards[1];
		console.log(c1);
		return c1.state._value! + c2.state._value! === 5;
	}
	public reset() {
		this.flippedCards.forEach((c) => c.flip());
	}
	private handleFlip = (e: CustomEvent<{ _id: number; _value?: number }>) => {
		if (!this.canFlip(e.detail._id)) return alert('Cannot Flip');
		console.log(`Flip on ${e.detail._id}`);
		this.flippedCards.push(this.cards[e.detail._id]);
		if (this.flippedCards.length === 2) {
			console.log(this.hasWon() ? 'Won' : 'Lost');
			this.reset();
		}
	};
	private handleCover = (e: CustomEvent<{ _id: number; _value?: number }>) => {
		if (!this.canFlip(e.detail._id)) return alert('Cannot Flip');
		console.log(`Cover on ${e.detail._id}`);
		remove(this.flippedCards, (c) => c.state._id === e.detail._id);
	};
	private handleClick = (cardId: number) => {
		if (!this.canFlip(cardId)) return alert('Cannot Flip');
		if (!this.cards[cardId]) return alert('Cannot Flip Card Not Exit');
		this.cards[cardId].flip();
	};
	public canFlip(cardId: number) {
		if (this.cards[cardId].state._status === 'FACEDOWN' && this.flippedCards.length === 2)
			return false;
		return true;
	}
	public initGame = (node: HTMLDivElement, { count = 5, valueFn = (i) => i }: InitOptions) => {
		for (let index = 0; index < count; index++) {
			console.log('created ');

			const nc = new PlayingCardThree({
				target: node,
				props: {
					state: {
						_id: index,
						_status: 'FACEDOWN',
						_value: valueFn(index)
					}
				}
			});

			this._cleanupEvents.push(
				nc.$on('click', () => this.handleClick(index)),
				nc.$on('reveal', this.handleFlip),
				nc.$on('cover', this.handleCover)
			);
			this.cards.push(nc);
		}
		return {
			destroy: () => {
				this._cleanupEvents.forEach((clean) => {
					console.log('Cleaned');
					clean();
				});

				this.cards.forEach((c) => {
					c.$destroy();
				});
			}
		};
	};
}

// export default class Game {
// 	private _flipped: CardState[] = []; // The cards that have been flipped within the game
// 	public deck: Deck = []; // The deck of cards
// 	public components: PlayingCardThree[] = [];
// 	public handleFlip = (e: CustomEvent<{ _id: number; _value?: number }>) => {
// 		if (!this.canFlip) return;
// 		console.log(`Flip on ${e.detail._id}`);
// 		this._flipped.push(this.deck[e.detail._id]);
// 	};
// 	public handleCover = (e: CustomEvent<{ _id: number; _value?: number }>) => {
// 		console.log(`Cover on ${e.detail._id}`);

// 		remove(this._flipped, (l) => l._id === e.detail._id);
// 	};
// 	constructor(private _maxFlipped: number = 2) {
// 		this.deck = createCards(10);
// 	}
// 	public flip(cardId: number): boolean {
// 		if (this.components[cardId]) {
// 			this.components[cardId].flip();
// 			return true;
// 		}
// 		return false;
// 	}
// 	public canFlip() {
// 		return this._flipped.length === this._maxFlipped;
// 	}
// 	public get flipped() {
// 		return console.log(this._flipped);
// 	}
// }
