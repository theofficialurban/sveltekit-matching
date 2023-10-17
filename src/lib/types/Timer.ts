import type Game from '$lib/classes/Game';
import type { Moment, Duration } from 'moment';
import type { ComponentEvents, EventDispatcher } from 'svelte';
import type GameTimer from '$lib/components/GameTimer/game-timer.svelte';
/**
 * @type TimerEventHandler - Custom event handler.
 */
type TimerEventHandler = (e: TimerComponentEvent) => void | Promise<void>;

type TimerEventCallback = (
	details: Timer | null,
	type: string,
	preventDefault: () => void
) => void | Promise<void>;

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
	Props: {
		class: string;
		game: Game;
	};
	Store: {
		start: Moment | null;
		now: Moment | null;
		end: Moment | null;
		duration: Duration | null;
		secondsLeft?: number;
		gameOver: 'true' | 'false' | 'notstarted';
	};
	Events: { start: Timer['Store']; end: Timer['Store']; stop: null };
	Dispatcher: EventDispatcher<Timer['Events']>;
	Handler: TimerEventHandler;
	Handlers: {
		start: TimerEventHandler;
		stop: TimerEventHandler;
		end: TimerEventHandler;
	};
	EventCallback: TimerEventCallback;
}
export type TimerComponentEvent =
	| ComponentEvents<GameTimer>['end']
	| ComponentEvents<GameTimer>['start']
	| ComponentEvents<GameTimer>['stop'];
