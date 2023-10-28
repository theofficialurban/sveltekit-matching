import { get, writable, type Writable } from 'svelte/store';
import type BicycleCardData from './Card';
import type CardGame from './CardGame';

type IN_PLAY_OBJECT = { one: BicycleCardData | null; two: BicycleCardData | null };

export default class InPlay {
	store: Writable<IN_PLAY_OBJECT> = writable<IN_PLAY_OBJECT>({ one: null, two: null });
	#_game: CardGame;
	constructor(_game: CardGame) {
		this.#_game = _game;
	}
	count = () => {
		let count = 0;
		const { one, two } = this.current;
		if (one) count += 1;
		if (two) count += 1;
		return count;
	};
	clearPlay = (slot: 'one' | 'two' | null = null): boolean => {
		switch (slot) {
			case 'one': {
				this.store.update((s) => {
					return { ...s, one: null };
				});
				return true;
			}
			case 'two': {
				this.store.update((s) => {
					return { ...s, two: null };
				});
				return true;
			}
			case null: {
				this.store.set({ one: null, two: null });
				return true;
			}
			default: {
				return false;
			}
		}
	};
	makePlay = (card: BicycleCardData): Promise<'one' | 'two'> => {
		return new Promise<'one' | 'two'>((resolve, reject) => {
			const { one, two } = this.current;

			if (!one) {
				this.store.update((s) => {
					return { ...s, one: card };
				});
				return resolve('one');
			} else if (!two) {
				const {
					handler: { actions, play$ }
				} = this.#_game;
				this.store.update((s) => {
					return { ...s, two: card };
				});
				play$({
					status: actions.check_cards
				});
				return resolve('two');
			}
			return reject();
		});
	};
	get current() {
		const { one, two } = get(this.store);
		return {
			one,
			two
		};
	}
}
