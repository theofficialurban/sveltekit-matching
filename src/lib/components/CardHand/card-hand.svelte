<script lang="ts">
	import { onDestroy } from 'svelte';

	import * as Bicycle from '$lib/components/BicycleCard';
	import CardControls from '../Dashboard/card-controls.svelte';
	import { crossfade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { flip } from 'svelte/animate';
	const game = Bicycle.Game;
	const {
		deck,
		reset,
		adminControls,
		play$,
		utils: { gameAction }
	} = game;
	const [send, recieve] = crossfade({ duration: 1500, easing: quintOut });

	onDestroy(() => {
		reset.apply(game);
	});
	play$({ status: gameAction('start') });
	const store = deck.getDeck();
</script>

{#if adminControls}
	<CardControls {game} />
{/if}

<div class="w-full container grid grid-cols-5">
	{#each $store as { store, flip: flipCard, id } (id)}
		<div
			in:recieve={{ key: id }}
			out:send={{ key: id }}
			animate:flip={{ duration: 500, easing: quintOut }}
		>
			<Bicycle.Card on:click={() => flipCard()} {game} {store} />
		</div>
	{/each}
</div>
