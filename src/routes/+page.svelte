<script lang="ts">
	import { DeckTwo } from '$lib/classes/Deck';
	import PlayingCardThree from '$lib/components/PlayingCardThree/playing-card-three.svelte';
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

	const deck = new DeckTwo({ count: 10, pairs: 0 });
	const cards = deck.cards;
	let value: number;
</script>

{#if $cards.length > 0}
	<input bind:value />
	<button on:click={() => console.log(deck.find(value))}>ff</button>
	<button
		on:click={() => {
			deck.re;
		}}>Shuffle</button
	>
	<div class="columns-5">
		{#each $cards as card (card._id)}
			<div
				in:recieve={{ key: card._id }}
				out:send={{ key: card._id }}
				animate:flip={{ duration: 200 }}
			>
				<svelte:component
					this={PlayingCardThree}
					on:click={() => (card._status = 'FACEUP')}
					{...card}
				/>
			</div>
		{/each}
	</div>
{/if}
