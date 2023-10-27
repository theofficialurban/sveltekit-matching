<script lang="ts">
	import PlayingCard from '$lib/components/PlayingCard/playing-card.svelte';

	import Cover from '$lib/assets/card-cover.png';
	import { flip } from 'svelte/animate';
	import { quintOut } from 'svelte/easing';
	import { crossfade, fade } from 'svelte/transition';
	import type GameManager from '$lib/stores/manager';
	import type { ComponentEvents } from 'svelte';
	import { GameNotifs } from '$lib/stores/manager';
	import { GameStatus } from '$lib/stores/game';
	export let game: GameManager;
	const {
		hand,
		vitals,
		notifications,
		settings: { playSize }
	} = game;
	const { current, store: vitalsStore } = vitals;
	let count = $vitalsStore._faceUpCt;
	const handleFaceUp = ({ preventDefault, detail }: ComponentEvents<PlayingCard>['faceup']) => {
		// Make sure game is in progress
		if ($vitalsStore._status !== GameStatus.INPROGRESS) return preventDefault();
		// Make sure there's a valid timer.
		if ($timerStore <= 0) return preventDefault();
		// If play succeeds
		if (!vitals.attemptPlay(detail)) return preventDefault();
		$vitalsStore._faceUpCt++;
		game.notifications.next({ status: GameNotifs.FACEUP, data: { card: detail, faceUpCt: count } });
	};
	const handleFaceDown = ({ preventDefault, detail }: ComponentEvents<PlayingCard>['facedown']) => {
		// Make sure game is in progress
		if ($vitalsStore._status !== GameStatus.INPROGRESS) return preventDefault();
		if ($timerStore <= 0) return preventDefault();
		game.notifications.next({ status: GameNotifs.FACEDOWN, data: { card: detail } });
		if (!vitals.resetPlay(detail)) {
			console.error('Cannot Remove Card from Played');
			return preventDefault();
		}
		$vitalsStore._faceUpCt--;
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
