<script lang="ts">
	import PlayingCardThree from '$lib/components/PlayingCardThree/playing-card-three.svelte';

	import Cover from '$lib/assets/card-cover.png';
	import { flip } from 'svelte/animate';
	import { quintOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';
	import type Game from '$lib/stores/game';
	export let game: Game;
	const { hand, playSize } = game;
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
	// on:click={() => {
	// 					if (hand.countFaceUp() >= playSize && card._status === 'FACEDOWN') return;
	// 					card._status = card._status === 'FACEDOWN' ? 'FACEUP' : 'FACEDOWN';
	// 				}}
	const { store } = hand;
</script>

{#if $store.length > 0}
	<div class="columns-5 mx-auto">
		{#each $store as card, id (card._id)}
			<div in:recieve={{ key: id }} out:send={{ key: id }} animate:flip={{ duration: 200 }}>
				<svelte:component
					this={PlayingCardThree}
					on:faceup
					on:facedown
					on:move
					bind:state={card}
					_cover={Cover}
				/>
			</div>
		{/each}
	</div>
{/if}
