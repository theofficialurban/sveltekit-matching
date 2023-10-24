import type PlayingCardComponent from '$lib/components/PlayingCard/playing-card.svelte';
import type CardStore from '$lib/stores/cards';
import type { ComponentEvents } from 'svelte';
import type { Tweened } from 'svelte/motion';

/**
 * @type CardEventTypes
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
 * @type CardComponentEvents
 * The CustomEvents created by the PlayingCard component
 */
type CardComponentEvents = ComponentEvents<PlayingCardComponent>;
/**
 * @type Status
 */
type CardStatus = 'FACEDOWN' | 'FACEUP';
/**
 * @type CardTransition
 * The transition using tweens for card flip
 */
export type CardTransition = { rotation: number; fade: number };

export type CardLike = Partial<Card> & { _id: number; _value: number };

export type CardMove = CardLike & { _prevStatus: CardStatus; _currentStatus: CardStatus };

/**
 * @type CardSlotClasses
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
/**
 * @interface PlayingCard
 * The standard types for the PlayingCard
 */
export default interface PlayingCard {
	/**
	 * @type State - The central card state that manages the card id, value, and status.
	 */
	State: Card;
	/**
	 * @type CardLike - Any card like data (contains the _id and _value at least)
	 */
	CardLike: CardLike | CardMove;
	/**
	 * @type Store - The CardStore that holds the current hand of cards.
	 */
	Store: CardStore;
	/**
	 * @type Deck - A hand of cards {Store: Writable<Deck>}
	 */
	Deck: Card[];
	/**
	 * @type Values - Mapping of _id => _value
	 */
	Values: Map<number, number>; // Card ID -> Card Value
	/**
	 * @type Pairs - _value => [card1, card2] Maps values to their pairs
	 */
	Pairs: Map<number, [number, number]>;
	/**
	 * @type Component - The Svelte Component
	 */
	Component: PlayingCardComponent;
	/**
	 * @prop Events - The types having to do with component events.
	 */
	Events: {
		/**
		 * @type Events.Types - Events {ComponentEvents<PlayingCard>}
		 */
		Types: CardComponentEvents;
		/**
		 * @type Events.DispatchTypes - The typings for dispatch()
		 */
		DispatchTypes: CardEventTypes;
	};
	/**
	 * @type Status - FACEUP or FACEDOWN
	 */
	Status: CardStatus;
	/**
	 * @prop Transition - The flip transition types
	 */
	Transition: {
		/**
		 * @type Transition.number - The numerical version of our Tweened store
		 */
		number: CardTransition;
		/**
		 * @type Transition.store - The regular Tweened<number> store
		 */
		store: { rotation: Tweened<number>; fade: Tweened<number> };
	};
	/**
	 * @prop Slots - Having to do with slots
	 */
	Slots: {
		/**
		 * @type Slots.Classes - The editable classes for the component
		 */
		Classes: CardSlotClasses;
	};
}
