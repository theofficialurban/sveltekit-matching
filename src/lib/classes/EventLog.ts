import type ICardGame from '$lib/types/CardGame';
import { writable, type Writable } from 'svelte/store';
import type CardGame from './CardGame';
import { isUndefined } from 'lodash-es';
interface IEventLogger {
	logEvent: (type: ICardGame['ACTION_KEY'], data: ICardGame['GAMESUBJECT']['data']) => boolean;
}
type GameEvent = {
	time: number;
	type: ICardGame['ACTION_KEY'];
	data: Required<ICardGame['SUBJECT_DATA']>;
};

export default class EventLogger implements IEventLogger {
	#_game: CardGame;
	#_eventLog: Writable<GameEvent[]> = writable<ICardGame['GAME_EVENT'][]>([]);
	constructor(_game: CardGame) {
		this.#_game = _game;
	}
	logEvent: IEventLogger['logEvent'] = (type, data): boolean => {
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
