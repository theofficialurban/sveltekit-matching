import type { Moment, DurationInputArg1, DurationInputArg2, Duration } from 'moment';
import { writable, type Writable } from 'svelte/store';
import moment from 'moment';
import type { ComponentEvents, EventDispatcher } from 'svelte';
import type GameTimerComponent from '$lib/components/GameTimer/game-timer.svelte';

/**
 * @interface Timer - The Timer object carried in the timer store.
 * @prop start - Start time of the timer
 * @prop now - Now
 * @prop end - The end time of the timer
 * @prop duration - The duration of the timer
 * @prop secondsLeft - The number of seconds remaining in the timer
 * @prop gameOver - The game over status
 */
export interface Timer {
	start: Moment | null;
	now: Moment | null;
	end: Moment | null;
	duration: Duration | null;
	secondsLeft?: number;
	gameOver: 'true' | 'false' | 'notstarted';
}
export type TimerComponentEvent =
	| ComponentEvents<GameTimerComponent>['end']
	| ComponentEvents<GameTimerComponent>['start']
	| ComponentEvents<GameTimerComponent>['stop'];
/**
 * @type TimerEvents - Events fired by game-timer.svelte
 */
export type TimerEvents = { start: Timer; end: Timer; stop: null };
/**
 * @type TimerEventHandler - Custom event handler.
 */
export type TimerEventHandler = (e: TimerComponentEvent) => void | Promise<void>;
/**
 * @type TimerEventHandlers - Contains the events for the timer.
 */
export type TimerEventHandlers = {
	start: TimerEventHandler;
	stop: TimerEventHandler;
	end: TimerEventHandler;
};
/**
 * @function TimerHandler()
 * @param fn A callback function that accepts the detail from the event and the type.
 * @param preventDefault boolean indicating whether to prevent action.
 * @returns A timer event handler.
 */
export function TimerHandler(
	fn: (d: TimerEvents, type: string) => void | Promise<void>,
	preventDefault: boolean = false
): TimerEventHandler {
	const handler: TimerEventHandler = ({ detail, type, preventDefault: prevent }: CustomEvent) => {
		if (preventDefault) return prevent();
		return fn(detail, type);
	};
	return handler;
}
/**
 * @class GameTimer
 * @classdesc The game timer with the timer store.
 * @properties
 * 		@static _timer - Singleton instance for the timer.
 * 		@private _store - A non-store object used to setup the store for each timer.
 * 		@private _dispatch - The dispatcher from the game-timer.svelte component.
 * 		@private _interval - The setInterval() id
 * 		@public duration - The duration (10 seconds , etc) for the timer.
 * 		@public store - The svelte store for the timer.
 * 		@public timerHandlers - The event handlers.
 */
export default class GameTimer {
	static _timer: GameTimer | null = null;
	private _store: Timer | null = null;
	private _dispatch: EventDispatcher<TimerEvents> | null = null;
	private _interval: number | null = null;
	public duration: { duration: DurationInputArg1; units: DurationInputArg2 } | null = null;
	public store: Writable<Timer> = writable<Timer>({
		start: null,
		now: null,
		end: null,
		duration: null,
		gameOver: 'notstarted'
	});
	private timerHandlers: TimerEventHandlers = {
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
	set handleStart(fn: TimerEventHandler) {
		this.timerHandlers.start = fn;
	}
	set handleStop(fn: TimerEventHandler) {
		this.timerHandlers.stop = fn;
	}
	set handleEnd(fn: TimerEventHandler) {
		this.timerHandlers.end = fn;
	}
	/**
	 * @private _setInterval sets the interval which counts seconds.
	 * @returns void
	 */
	private _setInterval(): void {
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
	/**
	 * @public bindDispatcher - Binds component dispatcher.
	 * @param dispatch - dispatch function from createEventDispatcher() in game-timer.svelte
	 * @returns
	 */
	public bindDispatcher(dispatch: EventDispatcher<TimerEvents>) {
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
