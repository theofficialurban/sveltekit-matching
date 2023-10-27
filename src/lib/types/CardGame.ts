import type BicycleCardData from '$lib/classes/Card';
import type CardGame from '$lib/classes/CardGame';
import type { Rule } from '$lib/classes/Rule';
import type { Tweened } from 'svelte/motion';
import type { Writable } from 'svelte/store';

type _Actions = {
	start: null;
	end: null;
	match: null;
	no_match: null;
};
type IN_PLAY_OBJECT = { 1: BicycleCardData | null; 2: BicycleCardData | null };
type GAME_STORE_OBJECT = {
	_score: number;
	_timer: Tweened<number>;
	_in_play: IN_PLAY_OBJECT;
};
export default interface ICardGame {
	GAME: CardGame;
	GAMERULE: Rule;
	GAMESUBJECT: { status: symbol; data?: object };
	OPTIONS: { adminControls?: boolean };
	ACTION_KEY: keyof _Actions;

	GAME_STORE: {
		OBJECT: GAME_STORE_OBJECT;
		STORE: Writable<GAME_STORE_OBJECT>;
		IN_PLAY_OBJECT: IN_PLAY_OBJECT;
	};
}
