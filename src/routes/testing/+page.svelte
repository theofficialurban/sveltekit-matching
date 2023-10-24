<script lang="ts">
	import type { PageData } from './$types';
	import BicycleCard from '$lib/classes/Card';
	import { writable } from 'svelte/store';
	import CardComponent from '$lib/components/PlayingCard/playing-card.svelte';
	import type PlayingCard from '$lib/types/Card';
	export let data: PageData;
	const store = writable<Map<number, BicycleCard>>(new Map<number, BicycleCard>());
	const card = new BicycleCard(store);
	const card2 = new BicycleCard(store);
</script>

{#each $store as [cardId, iCard]}
	<button on:click={() => iCard.delete()}>Delete Lol</button>
	<svelte:component
		this={CardComponent}
		on:click={() =>
			iCard.update((s, [id, c]) => {
				c.state._status = 'FACEUP';
			})}
		on:faceup={(e) => console.log(e.detail)}
		bind:state={iCard.state}
	/>
{/each}
