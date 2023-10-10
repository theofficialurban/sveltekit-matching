import type { CardState } from '$lib/components/PlayingCardThree/card';
export type Deck = CardState[];
export default function createCards(
	count: number = 5,
	valuation: (index: number) => number = (index) => index
): Deck {
	const newDeck: Deck = [];
	// Some function which will be called for each new card and must return the card formula

	for (let index = 0; index < count; index++) {
		const newCard: CardState = {
			_id: index,
			_status: 'FACEDOWN',
			_value: valuation(index)
		};
		newDeck.push(newCard);
	}
	return newDeck;
}
