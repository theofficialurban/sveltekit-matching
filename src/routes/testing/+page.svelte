<script lang="ts">
	import * as Bicycle from '$lib/components/BicycleCard/index';
	import f1 from '$lib/assets/card-face.png';
	import f2 from '$lib/assets/card2.png';
	import cover from '$lib/assets/card-cover.png';
	import { onDestroy, onMount } from 'svelte';
	const deck = Bicycle.Deck;
	deck.createCards(2, { pair: true, faceImages: [f1, f2], cover: cover });
	onDestroy(() => {
		deck.reset();
		console.log(deck);
	});
</script>

<button on:click={() => console.log(deck.pairs)}>Pairsss</button>
{#each deck as [id, card]}
	<Bicycle.Card on:click={() => card.flip()} bind:store={card.store} />
{/each}
