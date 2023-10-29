import { writable, type Writable } from 'svelte/store';
import type CardGame from './CardGame';
import { isUndefined } from 'lodash-es';
import type IEventLog from '$lib/types/EventLog';
import type IGameHandler from '$lib/types/GameHandler';
/**
 * @interface CEventLogger
 * Implementation interface for the class.
 */
interface CEventLogger {
	logEvent: (type: IGameHandler['Action'], data: IGameHandler['SubjectData']) => boolean;
	logError: (error: Error, data: IGameHandler['SubjectData']) => void | boolean;
}
/**
 * @class EventLogger
 * @implements CEventLogger
 * The event logger, a utility class which allows events to be logged based on event type
 */
export default class EventLogger implements CEventLogger {
	/**
	 * The Card Game instance
	 */
	#_game: CardGame;
	/**
	 * The event log store
	 */
	#_eventLog: Writable<IEventLog['GameEvent'][]> = writable<IEventLog['GameEvent'][]>([]);
	constructor(_game: CardGame) {
		this.#_game = _game;
	}
	/**
	 * @public @method logEvent()
	 * @param type The event type @see IGameHandler['Action']
	 * @param data The data for the event log @see IGameHandler['SubjectData']
	 * @returns True or false
	 */
	logEvent: CEventLogger['logEvent'] = (type, data): boolean => {
		if (isUndefined(data)) return false;
		this.#_eventLog.update((l) => {
			l.push({ time: new Date().getTime(), data, type });
			return l;
		});
		return true;
	};
	logError = (e: Error, data: IGameHandler['SubjectData']) => {
		if (isUndefined(data)) return false;
		this.#_eventLog.update((l) => {
			l.push({ time: new Date().getTime(), data, type: 'error' });
			return l;
		});
		return true;
	};
	/**
	 * @public @method reset()
	 * Resets the event log
	 */
	reset = () => {
		this.#_eventLog.set([]);
	};
	/**
	 * @public store()
	 * Gets the store (log)
	 */
	get store() {
		return {
			subscribe: this.#_eventLog.subscribe
		};
	}
}
