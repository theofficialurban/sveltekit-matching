<script lang="ts">
	import { base } from '$app/paths';
	import PlayingCardThree from '$lib/components/PlayingCardThree/playing-card-three.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import CardStore from '$lib/stores/cards';
	import Cover from '$lib/assets/card-cover.png';
	import Face from '$lib/assets/card-face.png';
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
	<Button on:click={() => deck.reset()} variant="secondary">Reset</Button>
	<Button on:click={() => console.log(values)} variant="secondary">Print Values</Button>
	<Button on:click={() => console.log(pairs)} variant="secondary">Print Pairs</Button>
	<Button on:click={() => console.log($store)} variant="secondary">Print Store</Button>
</div>

{#if $store.length > 0}
	<div class="columns-5 mx-auto">
		{#each $store as card, id (card._id)}
			<div in:recieve={{ key: id }} out:send={{ key: id }} animate:flip={{ duration: 200 }}>
				<svelte:component
					this={PlayingCardThree}
					on:click={() => (card._status = card._status === 'FACEDOWN' ? 'FACEUP' : 'FACEDOWN')}
					{...card}
					_image={Face}
					_cover={Cover}
				/>
			</div>
		{/each}
	</div>
{/if}
