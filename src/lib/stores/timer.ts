import type { DurationInputArg1, DurationInputArg2 } from 'moment';
import { writable, type Writable } from 'svelte/store';
import moment from 'moment';
import type { Timer } from '$lib/types/Timer';
import TimerHandler from '$lib/classes/handlers/TimerHandler';

export default class GameTimer {
	static _timer: GameTimer | null = null;
	private _store: Timer['Store'] | null = null;
	private _dispatch: Timer['Dispatcher'] | null = null;
	private _interval: NodeJS.Timeout | null = null;
	public duration: { duration: DurationInputArg1; units: DurationInputArg2 } | null = null;
	public store: Writable<Timer['Store']> = writable<Timer['Store']>({
		start: null,
		now: null,
		end: null,
		duration: null,
		gameOver: 'notstarted'
	});
	private timerHandlers: Timer['Handlers'] = {
		start: () => console.log('Start'),
		stop: () => console.log('Stop'),
		end: () => console.log('End')
	};
	constructor(duration: DurationInputArg1 = '30', units: DurationInputArg2 = 'seconds') {
		this.duration = { duration, units };
		return this;
	}
	get handlers() {
		return {
			handleStart: this.timerHandlers.start,
			handleStop: this.timerHandlers.stop,
			handleEnd: this.timerHandlers.end
		};
	}
	set handleStart(fn: Timer['EventCallback']) {
		this.timerHandlers.start = TimerHandler(fn);
	}
	set handleStop(fn: Timer['EventCallback']) {
		this.timerHandlers.stop = TimerHandler(fn);
	}
	set handleEnd(fn: Timer['EventCallback']) {
		this.timerHandlers.end = TimerHandler(fn);
	}
	/**
	 * @private _setInterval sets the interval which counts seconds.
	 * @returns void
	 */
	private _setInterval(): void {
		if (!this._store?.start || !this._store.end) return;
		const { end } = this._store;
		this._interval = setInterval(() => {
			this.store.update((gt: Timer['Store']) => {
				if (moment() >= end) {
					clearInterval(this._interval!);
					const returnVal: Timer['Store'] = { ...gt, gameOver: 'true' };
					if (this._dispatch) this._dispatch('end', returnVal);
					return returnVal;
				}
				const now = moment();
				const duration = moment.duration(end.diff(now));
				return { ...gt, now, duration, secondsLeft: Math.round(duration.asSeconds()) };
			});
		}, 1000);
	}
	/**
	 * @public bindDispatcher - Binds component dispatcher.
	 * @param dispatch - dispatch function from createEventDispatcher() in game-timer.svelte
	 * @returns
	 */
	public bindDispatcher(dispatch: Timer['Dispatcher']) {
		if (this._dispatch) return;
		this._dispatch = dispatch;
	}
	/**
	 * @private _gameOver() - Resets the timer.
	 * @returns Promise<void>
	 */
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
	/**
	 * @public stop() - Stops and clears the timer
	 * @returns Promise<void>
	 */
	public stop() {
		if (this._interval) clearInterval(this._interval);
		return this._gameOver();
	}
	/**
	 * @public start() - Starts the timer
	 * @param customDur - Duration {10, 'seconds'} etc
	 * @returns void
	 */
	public start(
		customDur: { duration: DurationInputArg1; units: DurationInputArg2 } = this.duration ?? {
			duration: 30,
			units: 'seconds'
		}
	): void {
		const { duration, units } = customDur;
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
	/**
	 * @static newTimer()
	 * @param duration
	 * @param units
	 * @returns A new instance of the timer (singleton)
	 */
	static newTimer(duration: DurationInputArg1 = '30', units: DurationInputArg2 = 'seconds') {
		if (this._timer) return this._timer;
		this._timer = new GameTimer(duration, units);
		return this._timer;
	}
}
