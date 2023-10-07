<script lang="ts">
	import getCardsStore from '$lib/stores/cards';
	const store = getCardsStore(10);
	let cardStore: any = [];
</script>

<button on:click={() => console.log(cardStore)}>Get States</button>
<div class="grid grid-flow-row grid-cols-5">
	{#each $store as card, i}
		<svelte:component this={card} bind:state={cardStore[i]} cardId={i}
			><img src={`https://placehold.co/235x331`} alt="Playing Card" /></svelte:component
		>
	{/each}
</div>
