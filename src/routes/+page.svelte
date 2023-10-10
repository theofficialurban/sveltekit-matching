<script lang="ts">
	import PlayingCardThree from '$lib/components/PlayingCardThree/playing-card-three.svelte';
	import ccreateCards, { type Deck } from '$lib/stores/cardss';
	const deck: Deck = ccreateCards(10);
	let components: any[] = [];
</script>

<button on:click={() => console.log(components)}>Show Array</button>
<div class="grid grid-flow-row grid-cols-5 gap-4">
	{#each deck as card, i}
		<svelte:component this={PlayingCardThree} bind:this={components[i]} bind:state={card}>
			<img
				class="w-[250px] h-[350px]"
				width="250px"
				height="350px"
				src="https://placehold.co/250x350"
				alt="card"
			/>
		</svelte:component>
	{/each}
</div>
