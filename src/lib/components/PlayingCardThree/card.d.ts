export type Status = 'FACEDOWN' | 'FACEUP';
export type CardEvents = {
	reveal: CardState;
	cover: CardState;
	initflip: CardState;
};
export type CardTransition = { rotation: number; fade: number };
export type CardSlotClasses = {
	card?: string; // The primary card class for both sides
	values?: string; // The classes for the values of the card in the corners
	facedown?: string; // Classes for the face down side
};
export type CardState = {
	_id: number;
	_image?: string;
	_value: number;
	_status?: Status;
};
