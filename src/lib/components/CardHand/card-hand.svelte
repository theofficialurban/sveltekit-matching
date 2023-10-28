<script lang="ts">
	import * as Bicycle from '$lib/components/BicycleCard';
	import { crossfade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { flip } from 'svelte/animate';
	import type CardGame from '$lib/classes/CardGame';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	export let game: CardGame;
	const { deck, inPlay } = game;
	const [send, recieve] = crossfade({ duration: 1500, easing: quintOut });
	const store = deck.getDeck();
	let totalCards = $store.length;

	function checkCards() {
		const { one, two } = inPlay.current;
		if (one && two) {
			const fn = () => {
				deck.setStatus('FACEDOWN', one.id, two.id);
				if (one.value === two.value) {
					return dispatch('match', { one, two });
				} else {
					return dispatch('nomatch', { one, two });
				}
			};
			setTimeout(fn, 2000);
		}
	}
</script>

{totalCards}
<div class="w-full container grid grid-cols-5">
	{#each $store as card (card.id)}
		<div
			in:recieve={{ key: card.id }}
			out:send={{ key: card.id }}
			animate:flip={{ duration: 500, easing: quintOut }}
		>
			<Bicycle.Card
				on:click={() => {
					if (inPlay.count() < 2 || card.status === 'FACEUP') return card.flip();
					console.log('onclick');
				}}
				on:faceup={(e) => {
					if (inPlay.count() >= 2) return e.preventDefault();
					console.log('faceup');
					card
						.playCard()
						.then((slot) => {
							if (inPlay.count() === 2) checkCards();
							console.log('Card played in slot', slot);
						})
						.catch(() => console.error('Could not play card'));
				}}
				on:facedown={(e) => {
					if (!card.unPlayCard()) return e.preventDefault();
					console.log('facedwn');
				}}
				{game}
				store={card.store}
			/>
		</div>
	{/each}
</div>
