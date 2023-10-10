import type { Status } from '$lib/components/PlayingCardThree/card';
export type CardProps = { _id: number; _status: Status; _value: unknown };
export type Deck = CardProps[];
export default function ccreateCards(count: number = 5): Deck {
	const newDeck: Deck = [];
	// Some function which will be called for each new card and must return the card formula
	const someFunc: (n: number) => number = (n: number) => {
		return n * 3;
	};
	for (let index = 0; index < count; index++) {
		const newCard: CardProps = { _id: index, _status: 'FACEDOWN', _value: someFunc(index) };
		newDeck.push(newCard);
	}
	return newDeck;
}
