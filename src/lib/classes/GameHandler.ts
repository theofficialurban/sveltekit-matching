import { includes, isUndefined } from 'lodash-es';
import { Subject, Subscription } from 'rxjs';
import type CardGame from './CardGame';
import { get } from 'svelte/store';
import type IGameHandler from '$lib/types/GameHandler';
import { Status } from './CardGame';

/**
 * @constant gameActions
 * The symbols for the game actions.
 * Each symbol represents a specific action within the game,
 * this class will serve to process each of these symbolic actions internally.
 * i.e when a match is made, the subject will fire the GAME_MATCH symbol and process the logic.
 */
export const gameActions: Record<IGameHandler['Action'], symbol> = {
	start: Symbol('GAME_START'),
	end: Symbol('GAME_END'),
	match: Symbol('GAME_MATCH'),
	no_match: Symbol('GAME_NO_MATCH'),
	check_cards: Symbol('GAME_CHECK_CARDS'),
	stop: Symbol('GAME_STOP'),
	error: Symbol('GAME_ERROR')
};
/**
 * @interface CGameHandler
 * Class implementation interface for GameHandler
 */
interface CGameHandler {
	play$: (status: IGameHandler['Action']) => boolean;
	unsubscribe: () => boolean;
}
const handleEnd: HandlerFunction = (game: CardGame, data: IGameHandler['SubjectData']) => {
	return new Promise<void>((resolve) => {
		console.log(data);
		game.gameStatus = Status.COMPLETE;
		game.makeFinalStats();
		resolve();
	});
};
const handleStart: HandlerFunction = (game: CardGame, data: IGameHandler['SubjectData']) => {
	return new Promise<void>((resolve) => {
		setTimeout(() => game.deck.shuffle(5), 500);
		game.gameStatus = Status.STARTED;
		console.log(data);
		resolve();
	});
};
const handleMatch: HandlerFunction = (g, data) => {
	return new Promise<void>((resolve) => {
		const remaining = data._cardsRemaining;
		const {
			handler: { play$ }
		} = g;
		if (remaining === 0) {
			g.gameStatus = Status.COMPLETE;
			play$('end');
		}
		resolve();
	});
};
const handleStop: HandlerFunction = (g: CardGame) => {
	return new Promise<void>((resolve) => {
		g.gameStatus = Status.STOPPED;
		g.reset();
		resolve();
	});
};
const handleError: HandlerFunction = () => {
	return new Promise<void>((resolve) => {
		console.error('Game Error');
		resolve();
	});
};
type HandlerFunction = (g: CardGame, d: IGameHandler['SubjectData']) => Promise<void>;
/**
 * @class GameHandler
 * @implements CGameHandler
 * A utility class to handle game events similarly to the way normal
 * component events are handled. Using RxJS subjects.
 */
export default class GameHandler implements CGameHandler {
	#_subject: Subject<IGameHandler['GameSubject']> = new Subject<IGameHandler['GameSubject']>();
	#_subscription: Subscription | null = null;
	#_game: CardGame;
	#_handlers: Map<symbol, HandlerFunction> = new Map<symbol, HandlerFunction>();
	constructor(_game: CardGame) {
		this.#_game = _game;
		this.addHandler('start', handleStart);
		this.addHandler('stop', handleStop);
		this.addHandler('match', handleMatch);
		this.addHandler('error', handleError);
		this.addHandler('end', handleEnd);
		this.#_listen();
	}

	#_listen = () => {
		this.#_subscription = this.#_subject.subscribe((s: IGameHandler['GameSubject']) => {
			return this.#_processSubject(s);
		});
		this.#_subscription.add(() => console.log('Subject Teardown'));
	};
	/**
	 * @private #_processSubject
	 * Processes logic from the listener
	 * @param {GameSubject}
	 */
	#_processSubject({ status, data }: IGameHandler['GameSubject']) {
		const cb = this.#_handlers.get(status);
		if (!includes(gameActions, status)) return;
		if (isUndefined(cb)) {
			const e = new Error('Unknown Game Event');

			this.#_game.eventLogger.logError(e, data);
			throw e;
		}
		cb(this.#_game, data).catch((e) => {
			this.#_game.eventLogger.logError(e, data);
			throw new Error(e);
		});
	}

	addHandler = (type: IGameHandler['Action'], fn: HandlerFunction) => {
		return this.#_handlers.set(gameActions[type], fn);
	};
	unsubscribe = () => {
		if (!this.#_subscription) return false;
		this.#_subscription.unsubscribe();
		this.#_subscription = null;
		return true;
	};
	makeData = (): IGameHandler['SubjectData'] => {
		const currentTime = get(this.#_game.timer.gameTimer);
		const currentScore = get(this.#_game.game).score;
		const ipo: IGameHandler['SubjectData'] = {
			_cardsRemaining: this.#_game.deck.getDeckCounts().total,
			_currentTime: currentTime,
			_score: currentScore,
			_inPlay: this.#_game.inPlay.current
		};

		return ipo;
	};
	play$: CGameHandler['play$'] = (status: IGameHandler['Action']): boolean => {
		if (!includes(gameActions, this.actions[status])) return false;
		const subData = this.makeData();
		const statusSymbol = this.actions[status];
		this.#_game.eventLogger.logEvent(status, subData);
		const nextObj: IGameHandler['GameSubject'] = { status: statusSymbol, data: subData };
		this.#_subject.next(nextObj);
		return true;
	};
	get actions() {
		return gameActions;
	}
}
