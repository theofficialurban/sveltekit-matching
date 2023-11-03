import type { EasingFunction } from 'svelte/transition';
import type CardGame from './CardGame';
import { linear } from 'svelte/easing';
import { isUndefined } from 'lodash-es';
import { tweened, type Tweened } from 'svelte/motion';
import { get } from 'svelte/store';
/**
 * @type {GTOptions} - Game Timer Options
 */
export type GTOptions = {
	time?: number;
	delay?: number;
	easing?: EasingFunction;
};
/**
 * Implementation interface
 */
interface IGameTimer {
	start: () => void;
	stop: () => void;
	reset: () => void;
}
/**
 * @class GameTimer
 * @implements {IGameTimer}
 * The game timer using Svelte tweens.
 */
export default class GameTimer implements IGameTimer {
	// # of Seconds (display / calculation)
	#_time: number = 60;
	// Actual duration (ms)
	#_duration: number = this.#_time * 1000;
	// Delay
	#_delay: number = 0;
	// Easing
	#_easing: EasingFunction = linear;
	// Tween
	#_timer: Tweened<number>;
	// Game
	#_game: CardGame;
	constructor(_game: CardGame, _options?: GTOptions) {
		this.#_game = _game;
		if (!isUndefined(_options)) {
			if (!isUndefined(_options.time)) {
				this.#_time = _options.time;
				this.#_duration = this.#_time * 1000;
			}
			if (!isUndefined(_options.delay)) this.#_delay = _options.delay;
			if (!isUndefined(_options.easing)) this.#_easing = _options.easing;
		}
		this.#_timer = tweened(this.#_time, {
			duration: this.#_duration,
			delay: this.#_delay,
			easing: this.#_easing
		});
		return this;
	}
	/**
	 * @public @method start()
	 * Starts the timer, and dispatches the end handle upon completion
	 * @returns void
	 */
	start = (): void => {
		const { play$ } = this.#_game.handler;

		play$('start');

		this.#_timer
			.set(0, { duration: this.#_duration, delay: this.#_delay, easing: this.#_easing })
			.then(() => {
				play$('end');
			})
			.catch((e) => {
				console.error(e);
			});
	};
	/**
	 * @public @method stop()
	 * Stops the timer.
	 */
	stop = (): void => {
		const { play$ } = this.#_game.handler;
		this.#_timer
			.set(this.current, { duration: 0, delay: 0 })
			.then(() => {
				play$('stop');
			})
			.catch((e) => {
				console.error(e);
			});
	};
	/**
	 * @public @method reset()
	 * Resets the timer
	 */
	reset = (): void => {
		this.#_timer.set(this.#_time, { duration: 0 });
	};
	/**
	 * @public @property gameTimer
	 */
	get gameTimer() {
		return {
			subscribe: this.#_timer.subscribe
		};
	}
	/**
	 * @private @property current time
	 */
	private get current() {
		return get(this.#_timer);
	}
	set timer(t: number) {
		this.#_time = t;
		this.#_duration = t * 1000;
		this.reset();
		return;
	}
	set delay(d: number) {
		this.#_delay = d;
		this.reset();
		return;
	}
	set easing(e: EasingFunction) {
		this.#_easing = e;
		this.reset();
		return;
	}
}
