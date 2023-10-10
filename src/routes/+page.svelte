<script lang="ts">
	import { DeckTwo } from '$lib/classes/Deck';
	import PlayingCardThree from '$lib/components/PlayingCardThree/playing-card-three.svelte';
	import { shuffle } from 'lodash-es';
	import { flip } from 'svelte/animate';
	import { quintOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';
	const [send, recieve] = crossfade({
		duration: 1000,
		fallback(node, params) {
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
	let card: PlayingCardThree;

	const deck = new DeckTwo({ count: 2, pairs: 0 });
</script>

<button on:click={() => deck.shuffle()}>State</button>
{#each deck.cards as card (card._id)}
	<div in:recieve={{ key: card._id }} out:send={{ key: card._id }} animate:flip={{ duration: 200 }}>
		<svelte:component
			this={PlayingCardThree}
			on:click={() => (card._status = 'FACEUP')}
			{...card}
		/>
	</div>
{/each}
