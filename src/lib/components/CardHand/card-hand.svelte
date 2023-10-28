<script lang="ts">
	import { onDestroy } from 'svelte';

	import * as Bicycle from '$lib/components/BicycleCard';
	import CardControls from '../Dashboard/card-controls.svelte';
	import { crossfade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { flip } from 'svelte/animate';
	const game = Bicycle.Game;
	const { deck, reset, adminControls, play$, gameStore } = game;
	const [send, recieve] = crossfade({ duration: 1500, easing: quintOut });

	onDestroy(() => {
		reset.apply(game);
	});
	const store = deck.getDeck();
</script>

{#if adminControls}
	<CardControls {game} />
{/if}
{$gameStore._score}
<div class="w-full container grid grid-cols-5">
	{#each $store as { store, flip: flipCard, id, playCard, unPlayCard } (id)}
		<div
			in:recieve={{ key: id }}
			out:send={{ key: id }}
			animate:flip={{ duration: 500, easing: quintOut }}
		>
			<Bicycle.Card
				on:faceup={(e) => {
					if (game.inPlayCount === 2) return e.preventDefault();

					playCard()
						.then((slot) => {
							console.log('Card played in slot', slot);
						})
						.catch(() => console.error('Could not play card'));
				}}
				on:facedown={(e) => {
					if (!unPlayCard()) return e.preventDefault();
				}}
				on:click={() => {
					if (game.inPlayCount < 2) return flipCard();
				}}
				{game}
				{store}
			/>
		</div>
	{/each}
</div>
