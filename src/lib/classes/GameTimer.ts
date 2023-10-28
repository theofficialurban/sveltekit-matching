import type { EasingFunction } from 'svelte/transition';
import type CardGame from './CardGame';
import { linear } from 'svelte/easing';
import { isUndefined } from 'lodash-es';
import { tweened, type Tweened } from 'svelte/motion';
import { get } from 'svelte/store';
export type GTOptions = {
	time?: number;
	delay?: number;
	easing?: EasingFunction;
};
interface IGameTimer {
	start: () => void;
	stop: () => void;
	reset: () => void;
}
export default class GameTimer implements IGameTimer {
	#_time: number = 60;
	#_duration: number = this.#_time * 1000;
	#_delay: number = 0;
	#_easing: EasingFunction = linear;
	#_timer: Tweened<number>;
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
	start = (): void => {
		const { makeSubjectData, play$, actions } = this.#_game;

		this.#_timer
			.set(0, { duration: this.#_duration, delay: this.#_delay, easing: this.#_easing })
			.then(() => {
				play$({ status: actions.end, data: makeSubjectData() });
			})
			.catch((e) => {
				console.error(e);
			});
	};
	stop = (): void => {
		const { makeSubjectData, play$, actions } = this.#_game;
		this.#_timer
			.set(this.current, { duration: 0, delay: 0 })
			.then(() => {
				play$({ status: actions.stop, data: makeSubjectData() });
			})
			.catch((e) => {
				console.error(e);
			});
	};
	reset = (): void => {
		this.#_timer.set(this.#_time, { duration: 0 });
	};
	get gameTimer() {
		return {
			subscribe: this.#_timer.subscribe
		};
	}
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
