export type Status = 'FACEDOWN' | 'FACEUP';
export type CardEvents = {
	reveal: { _id: number; _value?: number };
	cover: { _id: number; _value?: number };
	initflip: { _id: number; _value?: number };
};
export type CardTransition = { rotation: number; fade: number };
export type CardSlotClasses = {
	card?: string; // The primary card class for both sides
	values?: string; // The classes for the values of the card in the corners
	facedown?: string; // Classes for the face down side
};
export type CardState = {
	_id: number;
	_value?: number;
	_status: Status;
};
