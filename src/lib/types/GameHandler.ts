import type InPlay from '$lib/classes/InPlay';
import type { IN_PLAY_OBJECT } from '$lib/classes/InPlay';

interface SubjectData {
	_currentTime: number;
	_score: number;
	_cardsRemaining: number;
	_inPlay: IN_PLAY_OBJECT | InPlay;
}
type GameSubject = { status: symbol; data: SubjectData };
type HandlerActions = {
	start: null;
	end: null;
	match: null;
	no_match: null;
	check_cards: null;
	stop: null;
};
export default interface IGameHandler {
	GameSubject: GameSubject;
	SubjectData: SubjectData;
	Action: keyof HandlerActions;
}
