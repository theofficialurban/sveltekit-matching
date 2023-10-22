<script lang="ts">
	import PlayingCard from '$lib/components/PlayingCard/playing-card.svelte';

	import Cover from '$lib/assets/card-cover.png';
	import { flip } from 'svelte/animate';
	import { quintOut } from 'svelte/easing';
	import { crossfade, fade } from 'svelte/transition';
	import type GameManager from '$lib/stores/manager';
	import type { ComponentEvents } from 'svelte';

	export let game: GameManager;
	const {
		hand,
		vitals,
		settings: { playSize }
	} = game;
	const { current, store: vitalsStore } = vitals;
	let count = $vitalsStore._faceUpCt;
	const handleFaceUp = ({ preventDefault, detail }: ComponentEvents<PlayingCard>['faceup']) => {
		if ($timerStore <= 0) return preventDefault();
		if (!vitals.attemptPlay(detail)) return preventDefault();
		count++;
		if (count === 2) {
			console.log('Hello');
			vitals
				.gameResults()
				.then(() => {
					console.log('Remove and score');
					count -= 2;
					vitals.scoreSuccess().catch((e) => {
						console.error(e);
					});
				})
				.catch(() => {
					console.log('Reset Play');
					count -= 2;
					setTimeout(() => vitals.clearPlay(), 1000);
				});
		}
	};
	const handleFaceDown = ({ preventDefault, detail }: ComponentEvents<PlayingCard>['facedown']) => {
		if ($timerStore <= 0) return preventDefault();
		if (!vitals.resetPlay(detail)) {
			console.error('Cannot Remove Card from Played');
			return preventDefault();
		}
		count--;
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
{count}
{#if $store.length > 0 && $timerStore > 0}
	<div class="columns-5 mx-auto" transition:fade={{ duration: 1000 }}>
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
