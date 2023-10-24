import { get, writable, type Writable } from 'svelte/store';
import { uniqueId } from 'lodash-es';
import type { GameRule } from '$lib/classes/Rule';
import { Rule } from '$lib/classes/Rule';
import type GameManager from './manager';
import { GameNotifs } from './manager';
import type { CardLike, CardMove } from '$lib/types/Card';
interface _GameVitals {
	_gameId: number;
	_faceUp: Map<1 | 2, CardLikeData>;
	_faceUpCt: number;
	_score: number;
	_status: GameStatus;
	_statusString: string;
}
export enum GameStatus {
	ERROR,
	INPROGRESS,
	NOTSTARTED,
	ENDED
}
export type CardLikeData = CardMove | CardLike | null;
export function resolveStatus(status: GameStatus) {
	switch (status) {
		case 0:
			return 'ERROR';

		case 1:
			return 'IN PROGRESS';
		case 2:
			return 'NO GAME';
		case 3:
			return 'GAME OVER';
		default:
			return 'ERROR';
	}
}
export type Callback = (_vitals: GameVitals, ...args: unknown[]) => boolean | Promise<boolean>;
export default class GameVitals {
	private _store: Writable<_GameVitals> = writable<_GameVitals>();
	private _rules: Map<string, Rule> = new Map<string, Rule>();
	constructor(private _manager: GameManager) {
		this._resetStore();
		return this;
	}
	public reset() {
		this._resetSlot('both');
		this._resetStore();
		return;
	}

	public attemptPlay(card: CardLikeData) {
		if (this.current.faceUpCt >= this._manager.settings.playSize) return false;
		if (!this.current.one) {
			if (this._setCurrent(1, card)) return true;
		}
		if (!this.current.two) {
			if (this._setCurrent(2, card)) return true;
		}
		return false;
	}

	public resetPlay(card: CardLikeData): boolean {
		if (!card) return false;
		if (!this.current.one && !this.current.two) return false;
		if (this.current.one && this.current.one._id === card._id) {
			this._resetSlot(1);
			return true;
		} else if (this.current.two && this.current.two._id === card._id) {
			this._resetSlot(2);
			return true;
		}
		return false;
	}

	public scoreSuccess() {
		return new Promise<void>((resolve, reject) => {
			const { one, two } = this.current;
			if (one && two) {
				this.setScore(2);

				const clear = () =>
					this._manager.hand
						.removeCards(one._id, two._id)
						.then(() => {
							this._manager.notifications.next({
								status: GameNotifs.REMAINDER,
								data: { score: this.current.score, remaining: this._manager.hand.count.TOTAL }
							});
							this.clearPlay();
							resolve();
						})
						.catch(() => {
							reject('Could not remove and give score');
							this._err('Could not remove and give score');
						});
				setTimeout(clear, 1000);
			} else {
				reject('Either card one or card two is missing.');
			}
		});
	}
	public clearPlay(): boolean {
		this._resetSlot('both');
		return true;
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

	public _countCurrentlyPlayed() {
		const store = get(this._store);
		let faceUpCards = 0;
		if (store._faceUp.get(1) !== null && store._faceUp.get(1) !== undefined) faceUpCards++;
		if (store._faceUp.get(2) !== null && store._faceUp.get(2) !== undefined) faceUpCards++;
		return faceUpCards;
	}
	private _resetSlot(slot: 1 | 2 | 'both'): void {
		switch (slot) {
			case 1: {
				if (this.current.one !== null) {
					this._manager.hand.setStatus('FACEDOWN', this.current.one!._id);
				}
				this._setCurrent(1, null);
				break;
			}
			case 2: {
				if (this.current.two !== null) {
					this._manager.hand.setStatus('FACEDOWN', this.current.two!._id);
				}
				this._setCurrent(2, null);
				break;
			}
			case 'both': {
				if (this.current.two && this.current.one) {
					this._manager.hand.setStatus('FACEDOWN');
				}
				this._setCurrent(2, null) && this._setCurrent(1, null);
				break;
			}
			default: {
				break;
			}
		}
	}
	private _resetStore() {
		const newGameId: number = parseInt(uniqueId());
		const faceUp: Map<1 | 2, CardLikeData> = new Map<1 | 2, CardLikeData>();
		faceUp.set(1, null) && faceUp.set(2, null);
		this._store.set({
			_gameId: newGameId,
			_faceUp: faceUp,
			_faceUpCt: 0,
			_score: 0,
			_status: GameStatus.NOTSTARTED,
			_statusString: resolveStatus(GameStatus.NOTSTARTED)
		});

		return this;
	}
	set faceUpCt(value: number) {
		this._store.update((s) => {
			const pastVal = s._faceUpCt;
			return { ...s, _faceUpCt: pastVal + value };
		});
	}
	private _setCurrent(slot: 1 | 2, card: CardLikeData): boolean {
		switch (slot) {
			case 1: {
				this._store.update((s) => {
					const current = s._faceUp;
					current.set(1, card);
					return s;
				});
				return true;
			}
			case 2: {
				this._store.update((s) => {
					const current = s._faceUp;
					current.set(2, card);
					return s;
				});
				return true;
			}
			default:
				return false;
		}
	}
	private _err(text: string) {
		this.status = GameStatus.ERROR;

		throw `[Error Game Vitals] ${text}`;
	}

	get store() {
		const { subscribe, set, update } = this._store;
		return {
			subscribe,
			set,
			update
		};
	}
	get status() {
		const sval = get(this._store);
		return sval._status;
	}
	get statusHuman() {
		const sval = get(this._store);
		return resolveStatus(sval._status);
	}
	set status(status: GameStatus) {
		this._store.update((s) => {
			return { ...s, _status: status, _statusString: resolveStatus(status) };
		});
	}

	get admin() {
		return {
			rules: this._rules
		};
	}
	/**
	 * @get current()
	 * Gets the following
	 * 1) Card (or null) in slot one
	 * 2) Card (or null) in slot two
	 * 3) faceUpCt the # of cards that are currently face up
	 */
	get current() {
		const store = get(this._store);
		return {
			one: store._faceUp.get(1) ?? null,
			two: store._faceUp.get(2) ?? null,
			faceUpCt: store._faceUpCt,
			remainingCards: this._manager.hand.count.TOTAL,
			score: store._score
		};
	}
}
