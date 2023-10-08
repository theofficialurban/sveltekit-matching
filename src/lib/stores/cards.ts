import { writable, type Writable } from 'svelte/store';
import PlayingCard from '$lib/components/PlayingCard/playing-card.svelte';
import { tweened, type Tweened } from 'svelte/motion';
import type { SvelteComponent } from 'svelte';
export type Status = 'FACEDOWN' | 'FLIPPING' | 'FACEUP';
export type ComponentState<V = undefined> = {
	id: number;
	value?: V;
	status: Status;
	rotation: Tweened<number>;
};
export type CardState<C extends SvelteComponent, V = undefined> = {
	state: ComponentState<V>;
	self: C | null;
};
export default function getCardsStore(count: number = 5) {
	const newStore: Array<typeof PlayingCard> = [];
	for (let index = 0; index < count; index++) {
		newStore.push(PlayingCard);
	}
	const store = writable<Array<typeof PlayingCard>>(newStore);
	return store;
}
export function createCards<C extends SvelteComponent, V = undefined>(
	count: number = 5
): Writable<CardState<C, V>[]> {
	const newStore: CardState<C, V>[] = [];

	for (let index = 0; index < count; index++) {
		newStore.push({
			state: {
				id: index,
				status: 'FACEDOWN',
				rotation: tweened(0, { duration: 1000 })
			},
			self: null
		});
	}
	return writable<CardState<C, V>[]>(newStore);
}
