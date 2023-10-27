import type CardGame from '$lib/classes/CardGame';
import type { Rule } from '$lib/classes/Rule';

type _Actions = {
	start: null;
	end: null;
	match: null;
	no_match: null;
};

export default interface ICardGame {
	GAME: CardGame;
	GAMERULE: Rule;
	GAMESUBJECT: { status: symbol; data?: object };
	OPTIONS: { adminControls?: boolean };
	ACTION_KEY: keyof _Actions;
}
