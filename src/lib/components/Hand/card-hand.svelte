<script lang="ts">
	import PlayingCard from '$lib/components/PlayingCard/playing-card.svelte';

	import Cover from '$lib/assets/card-cover.png';
	import { flip } from 'svelte/animate';
	import { quintOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';
	import type GameManager from '$lib/stores/manager';
	import type { ComponentEvents } from 'svelte';

	export let game: GameManager;
	const {
		hand,
		vitals,
		settings: { playSize }
	} = game;
	const { current, store: vitalsStore } = vitals;
	$: count = current.count;
	const handleFaceUp = ({ preventDefault, detail }: ComponentEvents<PlayingCard>['faceup']) => {
		if (!vitals.attemptPlay(detail)) return preventDefault();
		if (current.count === 2) {
			console.log('Hello');
			vitals
				.gameResults()
				.then(() => {
					console.log('Remove and score');
					vitals.scoreSuccess().catch((e) => {
						console.error(e);
					});
				})
				.catch(() => {
					console.log('Reset Play');
					setTimeout(() => vitals.clearPlay(), 1000);
				});
		}
	};
	const handleFaceDown = ({ preventDefault, detail }: ComponentEvents<PlayingCard>['facedown']) => {
		if (!vitals.resetPlay(detail)) {
			console.error('Cannot Remove Card from Played');
			return preventDefault();
		}
	};
	const [send, recieve] = crossfade({
		duration: 1000,
		fallback(node, param) {
			const style = getComputedStyle(node);
			const transform = style.transform === 'none' ? '' : style.transform;

			return {
				duration: 600,
				easing: quintOut,
				css: (t) => `
				transform: ${transform} scale(${t});
				opacity: ${t}
			`
			};
		}
	});
	const { store } = hand;
	const { store: timerStore } = game.timer;
</script>

{$vitalsStore._score}
{$timerStore}
{#if $store.length > 0 && $timerStore > 0}
	<div class="columns-5 mx-auto">
		{#each $store as card, id (card._id)}
			<div in:recieve={{ key: id }} out:send={{ key: id }} animate:flip={{ duration: 200 }}>
				<svelte:component
					this={PlayingCard}
					on:faceup={handleFaceUp}
					on:facedown={handleFaceDown}
					on:move
					bind:state={card}
					_cover={Cover}
				/>
			</div>
		{/each}
	</div>
{/if}
