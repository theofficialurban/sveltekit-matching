import type { CardLikeData } from './game';
import type GameManager from './manager';

export default class CardSelection {
	private _current: Map<number, CardLikeData> = new Map();
	constructor(private _manager: GameManager, public size: number = 2) {
		for (let index = 1; index <= this.size; index++) {
			this._current.set(index, null);
		}
	}
	get playedCount() {
		let count = 0;
		this._current.forEach((c) => {
			if (c !== null) count++;
		});
		return count;
	}
	play(card: CardLikeData) {
		if (this.playedCount >= this.size) return false;

		if (!this.getPlayed(1)) {
			if (this._current.set(1, card)) return true;
		}
		if (!this.getPlayed(2)) {
			if (this._current.set(2, card)) return true;
		}
		return false;
	}
	reset(slot: number | null = null): boolean {
		if (slot === null) {
			this._current.set(1, null);
			this._current.set(2, null);
			return true;
		} else if (slot === 1) {
			this._current.set(1, null);
			return true;
		} else if (slot === 2) {
			this._current.set(2, null);
			return true;
		}
		return false;
	}
	getPlayed(index: number): CardLikeData {
		if (index > this.size) return null;
		const found = this._current.get(index);
		if (found === undefined) return null;
		return found;
	}
}
