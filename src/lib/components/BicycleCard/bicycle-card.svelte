<script lang="ts">
	import { tweened } from 'svelte/motion';
	import cardflip from './card-flip';
	import PlayingCardFace from './face/bicycle-card-face.svelte';
	import PlayingCardCover from './cover/bicycle-card-cover.svelte';
	import type BicycleCard from '$lib/types/BicycleCard';
	import { SvelteComponent, createEventDispatcher } from 'svelte';
	import type ICardGame from '$lib/types/CardGame';
	export class BicycleCardComponent extends SvelteComponent<
		{ store: BicycleCard['Store']; class: string; game: ICardGame['GAME'] },
		BicycleCard['Events'],
		{}
	> {}
	export let game: ICardGame['GAME'];
	export let store: BicycleCard['Store'];
	const className: string = '';
	export { className as class };
	const dispatch = createEventDispatcher<BicycleCard['Events']>();
	/**
	 * Transitions
	 * @prop rotation - A tween 0 -> 360 which flips the card
	 * @prop fade - -1 -> 1 applied with x^2 allowing a fade at 180 to show the flip of the card
	 */
	const transitions: BicycleCard['Transition']['store'] = {
		rotation: tweened(0, { duration: 1000 }),
		fade: tweened(-1, { duration: 1000 })
	};
	const { rotation, fade } = transitions;
	$: if ($store._status === 'FACEDOWN' && dispatch('facedown', $store, { cancelable: true })) {
		Promise.all([rotation.set(0), fade.set(-1)]).then(() => {
			dispatch('complete', $store);
		});
	} else if ($store._status === 'FACEUP' && dispatch('faceup', $store, { cancelable: true })) {
		Promise.all([rotation.set(360), fade.set(1)]).then(() => {
			dispatch('complete', $store);
		});
	}
</script>

<div
	id="_card"
	role="button"
	on:click
	on:keypress
	tabindex={$store._id}
	use:cardflip={{ rotation: $rotation, fade: $fade }}
	class={`w-[250px] h-[350px] relative text-black playing-card p-3 ${className}`}
>
	{#if $rotation > 180}
		<PlayingCardFace {store} />
	{:else if $rotation <= 180}
		<PlayingCardCover {store} />
	{/if}
</div>

<style>
	@font-face {
		font-family: PlayingCards;
		src: url($lib/assets/playingcards.TTF);
	}
	.playing-card {
		font-family: PlayingCards;
		width: 250px;
		height: 350px;
	}
</style>
