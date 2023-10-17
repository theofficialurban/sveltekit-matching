import type Game from '$lib/classes/Game';
import type PlayingCardComponent from '$lib/components/PlayingCard/playing-card.svelte';
import type CardStore from '$lib/stores/cards';
import type { ComponentEvents } from 'svelte';

/**
 * @typedef CardEventTypes
 * @event faceup - Event fired when the card COMPLETELY transitions to faceup
 * @event facedown - Event fired when the card COMPLETELY transitions to facedown
 * @event move - Event fired when the flip is initiated
 */
type CardEventTypes = {
	faceup: CardLike;
	facedown: CardLike;
	move: CardMove;
};
/**
 * @typedef CardComponentEvents
 * The CustomEvents created by the PlayingCard component
 */
type CardComponentEvents = ComponentEvents<PlayingCardComponent>;
/**
 * @typedef Status
 */
type CardStatus = 'FACEDOWN' | 'FACEUP';
/**
 * @type CardTransition
 * The transition using tweens for card flip
 */
type CardTransition = { rotation: number; fade: number };

type CardLike = Partial<Card> & { _id: number; _value: number };

type CardMove = CardLike & { _prevStatus: CardStatus; _currentStatus: CardStatus };

/**
 * @typedef CardSlotClasses
 * @property card - The classes applied to the body of the card
 * @property values - The classes applied to the numerical values of the card
 * @property facedown - The classes applied to the card while facedown
 */
type CardSlotClasses = {
	card?: string; // The primary card class for both sides
	values?: string; // The classes for the values of the card in the corners
	facedown?: string; // Classes for the face down side
};

/**
 * @typedef Card
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
	_status: PlayingCard['Status'];
	_cover?: string;
};
type CardEventHandler = (
	event: PlayingCard['Events']['Types']['facedown' | 'faceup' | 'move']
) => void | Promise<void>;

type CardEventHandlerCallback = (
	game: Game,
	details: PlayingCard['CardLike'] | CardMove,
	type: string,
	preventDefault: () => void
) => void | Promise<void>;
export type EventHandlerCallback = (
	game: Game,
	details: unknown,
	type: string,
	preventDefault: () => void
) => void;
export default interface PlayingCard {
	State: Card;
	CardLike: CardLike;
	Store: CardStore;
	Deck: Card[];
	Values: Map<number, number>; // Card ID -> Card Value
	Pairs: Map<number, [number, number]>;
	Component: PlayingCardComponent;
	Events: {
		Types: CardComponentEvents;
		DispatchTypes: CardEventTypes;
		Handler: CardEventHandler;
		Callback: CardEventHandlerCallback;
	};
	Status: CardStatus;
	Transition: CardTransition;
	Slots: {
		Classes: CardSlotClasses;
	};
}
