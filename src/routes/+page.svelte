<script lang="ts">
	import { createCards } from '$lib/stores/cards';
	import type PlayingCardTwo from '$lib/components/PlayingCardTwo/playing-card-two.svelte';
	import Card from '$lib/components/PlayingCardTwo/playing-card-two.svelte';
	const cards = createCards<PlayingCardTwo>(10);
</script>

<div class="columns-5 gap-6 overflow-hidden">
	{#each $cards as card (card.state.id)}
		<svelte:component
			this={Card}
			state={$cards[card.state.id].state}
			bind:this={$cards[card.state.id].self}
		>
			<img class="mx-auto" src="https://placehold.co/250x350" alt={`Card_${card.state.id}`} />
		</svelte:component>
	{/each}
</div>
