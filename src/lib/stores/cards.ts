import type { CardState } from '$lib/components/PlayingCardThree/card';
import { fill } from 'lodash-es';
//export type Deck = CardState[];

// export default class Deck {
// 	public cards: CardState[] = [];
// 	constructor() {}
// 	public createCard(count: number = 1) {
// 		for (let index = 0; index < count; index++) {
// 			const newIndex = Math.ceil(index * Math.random() * 100);
// 			if (this.cards[newIndex]) {
// 				console.error('Index error');
// 				return;
// 			}
// 			this.cards.push({
// 				_id: newIndex,
// 				_value: index
// 			});
// 		}
// 	}
// }

// export default function createCards(
// 	count: number = 5,
// 	pairs: number = 0,
// 	valueFn: (i: number) => number
// ): Deck {
// 	let newDeck: Deck = [];
// 	// Some function which will be called for each new card and must return the card formula

// 	for (let index = 0; index < count; index++) {
// 		const randomNum = Math.random() * 100;
// 		const newCard: CardState = {
// 			_id: index,
// 			_value: valueFn(index*randomNum)
// 		};
// 		const duplicated = fill(Array(pairs+1), newCard);
// 		newDeck = [...newDeck, ...duplicated];
// 	}
// 	return newDeck;
// }
