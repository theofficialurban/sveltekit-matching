<script lang="ts">
	import { base } from '$app/paths';
	import PlayingCardThree from '$lib/components/PlayingCardThree/playing-card-three.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import CardStore from '$lib/stores/cards';
	import Cover from '$lib/assets/card-cover.png';
	import Face from '$lib/assets/card-face.png';
	import Face2 from '$lib/assets/card2.png';
	import { flip } from 'svelte/animate';
	import { quintOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';
	import Dashboard from '$lib/components/Dashboard/dashboard.svelte';
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

	const deck = new CardStore(5, true, [Face, Face2]);
	const { store, values, pairs } = deck;
</script>

<Dashboard {deck} />
{#if $store.length > 0}
	<div class="columns-5 mx-auto">
		{#each $store as card, id (card._id)}
			<div in:recieve={{ key: id }} out:send={{ key: id }} animate:flip={{ duration: 200 }}>
				<svelte:component
					this={PlayingCardThree}
					on:click={() => (card._status = card._status === 'FACEDOWN' ? 'FACEUP' : 'FACEDOWN')}
					{...card}
					_cover={Cover}
				/>
			</div>
		{/each}
	</div>
{/if}
