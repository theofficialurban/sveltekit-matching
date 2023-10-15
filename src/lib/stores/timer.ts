import type { Moment, DurationInputArg1, DurationInputArg2, Duration } from 'moment';
import { writable, type Writable } from 'svelte/store';
import moment from 'moment';
import type { EventDispatcher } from 'svelte';
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
	private _dispatch: EventDispatcher<{ start: Timer; end: Timer; stop: null }> | null = null;

	static _timer: GameTimer | null = null;
	private _interval: number | null = null;
	constructor(duration: DurationInputArg1 = '30', units: DurationInputArg2 = 'seconds') {
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
					if (this._dispatch) this._dispatch('end', returnVal);
					return returnVal;
				}
				const now = moment();
				const duration = moment.duration(end.diff(now));
				return { ...gt, now, duration, secondsLeft: Math.round(duration.asSeconds()) };
			});
		}, 1000);
	}
	public bindDispatcher(dispatch: EventDispatcher<{ start: Timer; end: Timer; stop: null }>) {
		if (this._dispatch) return;
		this._dispatch = dispatch;
	}
	private _gameOver(): Promise<void> {
		return new Promise<void>((resolve) => {
			if (this._dispatch) this._dispatch('stop');
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
		if (this._interval) clearInterval(this._interval);
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
		if (this._dispatch) {
			if (this._dispatch('start', this._store, { cancelable: true })) {
				this.store.set(this._store);
				this._setInterval();
				return;
			}
		} else {
			this.store.set(this._store);
			this._setInterval();
		}
	}
	static newTimer(duration: DurationInputArg1 = '30', units: DurationInputArg2 = 'seconds') {
		if (this._timer) return this._timer;
		this._timer = new GameTimer(duration, units);
		return this._timer;
	}
}
