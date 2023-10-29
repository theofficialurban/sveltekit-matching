import { writable, type Writable } from 'svelte/store';
import type CardGame from './CardGame';
import { isUndefined } from 'lodash-es';
import type IEventLog from '$lib/types/EventLog';
import type IGameHandler from '$lib/types/GameHandler';
interface CEventLogger {
	logEvent: (type: IGameHandler['Action'], data: IGameHandler['SubjectData']) => boolean;
}

export default class EventLogger implements CEventLogger {
	#_game: CardGame;
	#_eventLog: Writable<IEventLog['GameEvent'][]> = writable<IEventLog['GameEvent'][]>([]);
	constructor(_game: CardGame) {
		this.#_game = _game;
	}
	logEvent: CEventLogger['logEvent'] = (type, data): boolean => {
		if (isUndefined(data)) return false;
		this.#_eventLog.update((l) => {
			l.push({ time: new Date().getTime(), data, type });
			return l;
		});
		return true;
	};
	reset = () => {
		this.#_eventLog.set([]);
	};
	get store() {
		return {
			subscribe: this.#_eventLog.subscribe
		};
	}
}
