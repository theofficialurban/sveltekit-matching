<script lang="ts">
	import PlayingCardThree from '$lib/components/PlayingCardThree/playing-card-three.svelte';
	import type CardStore from '$lib/stores/cards';
	import Cover from '$lib/assets/card-cover.png';
	import { flip } from 'svelte/animate';
	import { quintOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';
	export let hand: CardStore;
	const [send, recieve] = crossfade({
		duration: 1000,
		fallback(node) {
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
</script>

{#if $store.length > 0}
	<div class="columns-5 mx-auto">
		{#each $store as card, id (card._id)}
			<div in:recieve={{ key: id }} out:send={{ key: id }} animate:flip={{ duration: 200 }}>
				<svelte:component
					this={PlayingCardThree}
					on:click={() => {
						card._status = card._status === 'FACEDOWN' ? 'FACEUP' : 'FACEDOWN';
					}}
					{...card}
					_cover={Cover}
				/>
			</div>
		{/each}
	</div>
{/if}
