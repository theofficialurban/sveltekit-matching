import { writable } from 'svelte/store';
import PlayingCard from '$lib/components/PlayingCard/playing-card.svelte';
export default function getCardsStore(count: number = 5) {
	const newStore: Array<typeof PlayingCard> = [];
	for (let index = 0; index < count; index++) {
		console.log(index);
		newStore.push(PlayingCard);
	}
	const store = writable<Array<typeof PlayingCard>>(newStore);
	return store;
}
