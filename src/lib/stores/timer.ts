import { linear } from 'svelte/easing';
import { tweened, type Tweened } from 'svelte/motion';
import type { EasingFunction } from 'svelte/transition';
import { GameStatus } from '$lib/classes/Game';
import { get } from 'svelte/store';
import type GameManager from './manager';

export default class Timer {
	private _tween: Tweened<number> = tweened(this._duration, {
		duration: 1000 * this._duration,
		easing: this._easing
	});
	constructor(
		private _manager: GameManager,
		private _duration: number = 30,
		private _easing: EasingFunction = linear
	) {
		return this;
	}
	start() {
		this._manager.vitals.status = GameStatus.INPROGRESS;
		this._tween.set(0).then(() => {
			this._manager.vitals.status = GameStatus.ENDED;
			this._manager.vitals.callback('gameover');
		});
	}
	stop() {
		if (this._manager.vitals.status !== GameStatus.INPROGRESS) {
			console.error('Invalid Game Status');
			return;
		}
		const time = get(this._tween);
		this._manager.vitals.status = GameStatus.ENDED;
		//this._manager.vitals.callback<{ time: number }>('stop', { time: time });
		return this._tween.set(time, { duration: 0 });
	}
	reset() {
		this._tween.set(this._duration, { duration: 0 });
		this._manager.vitals.status = GameStatus.NOTSTARTED;
		this._manager.vitals.callback('reset');
	}
	hasTime() {
		const time = get(this._tween);
		return time > 0;
	}
	get store() {
		return { ...this._tween };
	}
}
