import type Game from '$lib/classes/Game';
import type { CardLikeData } from '$lib/classes/Played';
import { get, writable, type Writable } from 'svelte/store';
import { uniqueId } from 'lodash-es';
import type { GameRule } from '$lib/classes/Rule';
import { Rule } from '$lib/classes/Rule';
import type GameManager from './manager';
interface _GameVitals {
	_game?: Game;
	_gameId: number;
	_faceUp: Map<1 | 2, CardLikeData>;
	_score: number;
	_status: GameStatus;
}
enum GameStatus {
	WIN,
	ERROR,
	LOSS,
	INPROGRESS,
	NOTSTARTED,
	ENDED
}
export type Callback = (_vitals: GameVitals, ...args: unknown[]) => boolean | Promise<boolean>;
type CallbacksCollection = Map<string, Callback>;
export default class GameVitals {
	private _store: Writable<_GameVitals> = writable<_GameVitals>();
	private _callbacks: CallbacksCollection = new Map<string, Callback>();
	private _rules: Map<string, Rule> = new Map<string, Rule>();
	constructor(private _manager: GameManager) {
		this.resetStore();
		return this;
	}
	get admin() {
		return {
			callbacks: this._callbacks,
			rules: this._rules
		};
	}
	public resetStore() {
		const newGameId: number = parseInt(uniqueId());
		const faceUp: Map<1 | 2, CardLikeData> = new Map<1 | 2, CardLikeData>();
		faceUp.set(1, null) && faceUp.set(2, null);
		this._store.set({
			_gameId: newGameId,
			_faceUp: faceUp,
			_score: 0,
			_status: GameStatus.NOTSTARTED
		});

		return this;
	}
	public gameResults(): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			if (this._rules.size === 0) return reject('No Game Rules');
			const promises: (Promise<void> | Promise<boolean>)[] = [];
			this._rules.forEach((r) => {
				promises.push(r.attempt(this));
			});
			Promise.all(promises)
				.then(() => resolve())
				.catch(() => reject('Rule Failed'));
		});
	}
	public setScore(addPoints: number) {
		this._store.update((s) => {
			console.log(`Setting Score: ${addPoints}`);
			return { ...s, _score: (s._score += addPoints) };
		});
		return this;
	}
	public addGameRule(name: string, rule: GameRule) {
		const newRule = new Rule(name, rule);
		this._rules.set(newRule.info.name, newRule);
	}
	public addCallback(name: string, callback: Callback): boolean {
		if (this._callbacks.has(name)) return false;
		this._callbacks.set(name, callback);
		return true;
	}
	public callback<T = unknown | object>(name: string, ...args: T[]) {
		return new Promise((resolve, reject) => {
			const cb = this._callbacks.get(name);
			if (cb === undefined) return reject('Callback Not Found');
			const result = cb(this, ...args);
			if (result === true) resolve(true);
		});
	}
	public _err(text: string) {
		this.status = GameStatus.ERROR;

		throw `[Error Game Vitals] ${text}`;
	}
	get status() {
		const sval = get(this._store);
		return sval._status;
	}
	get resolvedStatus() {
		const sval = get(this._store);
		switch (sval._status) {
			case 0:
				return 'Win';
			case 1:
				return 'Error';
			case 2:
				return 'Loss';
			case 3:
				return 'In Progress';
			case 4:
				return 'Not Started';
			case 5:
				return 'Ended';
			default:
				return 'Error';
		}
	}
	set status(status: GameStatus) {
		this._store.update((s) => {
			return { ...s, _status: status };
		});
	}
	get store() {
		const { subscribe, set, update } = this._store;
		return {
			subscribe,
			set,
			update
		};
	}
}
