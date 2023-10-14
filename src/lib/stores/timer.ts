import type { Moment, DurationInputArg1, DurationInputArg2, Duration } from 'moment';
import { writable, type Writable } from 'svelte/store';
import moment from 'moment';
export interface Timer {
	start: Moment | null;
	now: Moment | null;
	end: Moment | null;
	duration: Duration | null;
	secondsLeft?: number;
	gameOver: 'true' | 'false' | 'notstarted';
}
export type TimerCallbacks = {
	start?: (timer: Timer) => void;
	stop?: (timer?: Timer) => void;
	end?: (timer: Timer) => void;
};
export default class GameTimer {
	private _store: Timer | null = null;
	public _duration: { duration: DurationInputArg1; units: DurationInputArg2 } | null = null;
	public store: Writable<Timer> = writable<Timer>({
		start: null,
		now: null,
		end: null,
		duration: null,
		gameOver: 'notstarted'
	});
	private _callbacks: TimerCallbacks = {
		start: () => null,
		stop: () => null,
		end: () => null
	};
	static _timer: GameTimer | null = null;
	private _interval: number | null = null;
	constructor(
		duration: DurationInputArg1 = '30',
		units: DurationInputArg2 = 'seconds',
		callbacks?: TimerCallbacks
	) {
		if (callbacks !== undefined) {
			this._callbacks = { ...callbacks };
		}
		this._duration = { duration, units };
		return this;
	}

	private _setInterval() {
		if (!this._store?.start || !this._store.end) return;
		const { end } = this._store;
		this._interval = setInterval(() => {
			this.store.update((gt) => {
				if (moment() >= end) {
					clearInterval(this._interval!);
					const returnVal: Timer = { ...gt, gameOver: 'true' };
					if (this._callbacks.end) this._callbacks.end(returnVal);
					return returnVal;
				}
				const now = moment();
				const duration = moment.duration(end.diff(now));
				return { ...gt, now, duration, secondsLeft: Math.round(duration.asSeconds()) };
			});
		}, 1000);
	}
	private _gameOver(): Promise<void> {
		return new Promise<void>((resolve) => {
			if (this._callbacks.stop) this._callbacks.stop();
			this.store.set({
				start: null,
				now: null,
				end: null,
				duration: null,
				gameOver: 'notstarted'
			});
			resolve();
		});
	}
	public stop() {
		if (!this._interval) return;
		clearInterval(this._interval);
		return this._gameOver();
	}
	public start() {
		if (!this._duration) return;
		const { duration, units } = this._duration;
		const end = moment().add(duration, units);
		const start = moment();
		const now = moment();
		this._store = {
			start,
			now,
			end,
			gameOver: 'false',
			duration: moment.duration(end.diff(now))
		};
		this.store.set(this._store);
		this._setInterval();
		if (this._callbacks.start) this._callbacks.start(this._store);
	}
	static newTimer(
		duration: DurationInputArg1 = '30',
		units: DurationInputArg2 = 'seconds',
		callbacks?: TimerCallbacks
	) {
		if (this._timer) return this._timer;
		this._timer = new GameTimer(duration, units, callbacks);
		return this._timer;
	}
}
