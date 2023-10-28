import type BicycleCardData from '$lib/classes/Card';
import type CardGame from '$lib/classes/CardGame';
import type { Rule } from '$lib/classes/Rule';
import type { Tweened } from 'svelte/motion';
import type { Writable } from 'svelte/store';
import type { EasingFunction } from 'svelte/transition';
type _Actions = {
	start: null;
	end: null;
	match: null;
	no_match: null;
	check_cards: null;
	stop: null;
};
type IN_PLAY_OBJECT = { 1: BicycleCardData | null; 2: BicycleCardData | null };
type GAME_STORE_OBJECT = {
	_score: number;
	_timer: Tweened<number>;
	_in_play: IN_PLAY_OBJECT;
	_active: boolean;
};
interface SubjectData {
	_currentTime: number;
	_score: number;
	_cards: IN_PLAY_OBJECT;
	_cardsRemaining: number;
}
export default interface ICardGame {
	GAME: CardGame;
	GAMERULE: Rule;
	GAMESUBJECT: { status: symbol; data?: SubjectData };
	GAME_EVENT: { time: number; type: keyof _Actions; data: SubjectData };
	GAME_EVENT_LOG: Writable<ICardGame['GAME_EVENT'][]>;
	OPTIONS: {
		adminControls?: boolean;

		timer: { time: number; duration: number; delay?: number; easing?: EasingFunction };
	};
	ACTION_KEY: keyof _Actions;
	SUBJECT_DATA: SubjectData;
	GAME_STORE: {
		OBJECT: GAME_STORE_OBJECT;
		STORE: Writable<GAME_STORE_OBJECT>;
		IN_PLAY_OBJECT: IN_PLAY_OBJECT;
	};
}
