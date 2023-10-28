import type { Tweened } from 'svelte/motion';
import type { Writable } from 'svelte/store';
import type BicycleCardComponent from '$lib/components/BicycleCard/bicycle-card.svelte';
import type BicycleCardDeck from '$lib/classes/Deck';
import type BicycleCardData from '$lib/classes/Card';
import type { SvelteComponent } from 'svelte';
/**
 * @type Card
 * @param _id - The unique ID (key) of the card
 * @param _status - The status (FACEUP | FACEDOWN) of the card
 * @param _value - The card value
 * @param _cover - The card cover or design (back)
 * @param _image - The card image (face)
 */
type Card = {
	_id: number;
	_image: string;
	_value: number;
	_status: CardStatus;
	_cover?: string;
	_svgGraphic?: SvelteComponent;
};
/**
 * @type Status
 */
type CardStatus = 'FACEDOWN' | 'FACEUP';

type CardLike = Partial<Card> & { _id: number; _value: number };

type CardMove = CardLike & { _prevStatus: CardStatus; _currentStatus: CardStatus };
export default interface BicycleCard {
	Deck: BicycleCardDeck;
	DeckStore: Writable<BicycleCardData[]>;
	State: Card;
	Component: BicycleCardComponent;
	Store: Writable<Card>;
	CardLikeData: CardMove | CardLike;
	Status: CardStatus;
	/**
	 * @prop Transition - The flip transition types
	 */
	Transition: {
		/**
		 * @type Transition.number - The numerical version of our Tweened store
		 */
		number: { rotation: number; fade: number };
		/**
		 * @type Transition.store - The regular Tweened<number> store
		 */
		store: { rotation: Tweened<number>; fade: Tweened<number> };
	};
	Events: {
		faceup: BicycleCard['CardLikeData'];
		facedown: BicycleCard['CardLikeData'];
		complete: BicycleCard['CardLikeData'];
	};
	Options: {
		faceImages?: string[];
		cover?: string;
		pair?: boolean;
		count?: number;
	};
}
