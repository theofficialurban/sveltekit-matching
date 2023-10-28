import { includes } from 'lodash-es';
import { Subject, Subscription } from 'rxjs';
import type CardGame from './CardGame';
interface SubjectData {
	_currentTime: number;
	_score: number;
	_cardsRemaining: number;
}
type GameSubject = { status: symbol; data?: SubjectData };
/**
 * @constant gameActions
 * The symbols for the game actions.
 * Each symbol represents a specific action within the game,
 * this class will serve to process each of these symbolic actions internally.
 * i.e when a match is made, the subject will fire the GAME_MATCH symbol and process the logic.
 */
export const gameActions = {
	start: Symbol('GAME_START'),
	end: Symbol('GAME_END'),
	match: Symbol('GAME_MATCH'),
	no_match: Symbol('GAME_NO_MATCH'),
	check_cards: Symbol('GAME_CHECK_CARDS'),
	stop: Symbol('GAME_STOP')
};
interface IGameHandler {
	play$: (next: GameSubject) => boolean;
	unsubscribe: () => boolean;
}

export default class GameHandler implements IGameHandler {
	#_subject: Subject<GameSubject> = new Subject<GameSubject>();
	#_subscription: Subscription | null = null;
	#_game: CardGame;
	constructor(_game: CardGame) {
		this.#_game = _game;
		this.#_listen();
	}
	#_listen = () => {
		this.#_subscription = this.#_subject.subscribe((s: GameSubject) => {
			return this.#_processSubject(s);
		});
		this.#_subscription.add(() => console.log('Subject Teardown'));
	};
	/**
	 * @private #_processSubject
	 * Processes logic from the listener
	 * @param {GameSubject}
	 */
	#_processSubject({ status }: GameSubject) {
		if (!includes(gameActions, status)) return;
		console.log(status);
	}
	// makeSubjectData = (cardsOverwrite: ICardGame['GAME_STORE']['IN_PLAY_OBJECT'] | null = null) => {
	// 	const store = this.currentStore;
	// 	const data: ICardGame['GAMESUBJECT']['data'] = {
	// 		_cards: cardsOverwrite ? cardsOverwrite : store._in_play,
	// 		_cardsRemaining: this.deck.getDeckCounts().total,
	// 		_currentTime: get(store._timer),
	// 		_score: store._score
	// 	};
	// 	return data;
	// };
	unsubscribe = () => {
		if (!this.#_subscription) return false;
		this.#_subscription.unsubscribe();
		this.#_subscription = null;
		return true;
	};
	play$ = (s: GameSubject): boolean => {
		if (!includes(gameActions, s.status)) return false;
		this.#_subject.next(s);
		return true;
	};
	get actions() {
		return gameActions;
	}
}
