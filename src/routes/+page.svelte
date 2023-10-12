<script lang="ts">
	import PlayingCardThree from '$lib/components/PlayingCardThree/playing-card-three.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import CardStore from '$lib/stores/cards';
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

	const deck = new CardStore(5, true);
	const { store, values, pairs } = deck;
</script>

<div class="container">
	<Button on:click={() => deck.shuffle(3)} variant="secondary">Shuffle</Button>
	<Button on:click={() => console.log(values)} variant="secondary">Print Values</Button>
	<Button on:click={() => console.log(pairs)} variant="secondary">Print Pairs</Button>
	<Button on:click={() => console.log($store)} variant="secondary">Print Store</Button>
</div>

{#if $store.length > 0}
	<div class="columns-5">
		{#each $store as card, id (card._id)}
			<div in:recieve={{ key: id }} out:send={{ key: id }} animate:flip={{ duration: 200 }}>
				<svelte:component
					this={PlayingCardThree}
					on:click={() => (card._status = 'FACEUP')}
					{...card}
				/>
			</div>
		{/each}
	</div>
{/if}
