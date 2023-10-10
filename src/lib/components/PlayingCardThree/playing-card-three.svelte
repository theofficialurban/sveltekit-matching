<svelte:options accessors={true} />

<script lang="ts">
	import type { CardEvents, CardSlotClasses, CardState, CardTransition, Status } from './card';
	import { createEventDispatcher } from 'svelte';
	import { base } from '$app/paths';
	import { tweened, type Tweened } from 'svelte/motion';
	const dispatch = createEventDispatcher<CardEvents>();

	const transition: { rotation: Tweened<number>; fade: Tweened<number> } = {
		rotation: tweened(0, { duration: 1000 }),
		fade: tweened(-1, { duration: 1000 })
	};
	const { rotation, fade } = transition;
	export let state: CardState;
	export let classes: CardSlotClasses = {
		card: 'w-[250px] h-[350px] relative text-black playing-card p-3',
		values: 'p-6 text-3xl text-red-600 font-extrabold',
		facedown: ' object-contain'
	};
	export const flip = () => {
		if (!state || !state._status) console.error('Error');
		dispatch('initflip', { _id: state._id, _value: state._value });
		if (state._status === 'FACEDOWN') {
			Promise.allSettled([rotation.set(360), fade.set(1)]).then(() => {
				dispatch('reveal', { _id: state._id, _value: state._value });
				state._status = 'FACEUP';
				// Event Fire
			});
		} else if (state._status === 'FACEUP') {
			Promise.allSettled([rotation.set(0), fade.set(-1)]).then(() => {
				dispatch('cover', { _id: state._id, _value: state._value });
				state._status = 'FACEDOWN';
				// Event Fire
			});
		}
	};
	const flipper = (node: HTMLElement, options: CardTransition) => {
		return {
			update({ rotation, fade }: CardTransition) {
				let styles = `opacity: ${fade * fade * 100}%; transform: rotate3d(0,1,0,${rotation}deg);`;
				node.setAttribute('style', styles);
			}
		};
	};
	$: if (state._status === 'FACEDOWN') {
		$rotation = 0;
		$fade = -1;
	} else if (state._status === 'FACEUP') {
		$rotation = 360;
		$fade = 1;
	}
</script>

<div
	role="button"
	on:click
	on:keypress
	tabindex={state._id}
	use:flipper={{ rotation: $rotation, fade: $fade }}
	class={classes.card}
>
	{#if $rotation > 180}
		<div class="">
			<img
				class="rounded-xl"
				src="https://academics.otc.edu/media/uploads/sites/35/2015/10/not-pictured-250x350.png"
				alt="card"
			/>
			<span class="bottom-0.5 absolute font-extrabold">ID: {state._id}</span>
			<span class={`top-0 left-0 absolute ${classes.values}`}>{state._value}</span>
			<span class={`top-0 right-0 absolute ${classes.values}`}>{state._value}</span>
			<span class="right-0 bottom-0 absolute font-extrabold">{state._status}</span>
		</div>
	{:else if $rotation <= 180}
		<img
			class={classes.facedown}
			src={`${base}/playing-card-235x331.png`}
			alt={`Card${state._id}`}
		/>
	{/if}
</div>

<style>
	@font-face {
		font-family: PlayingCards;
		src: url(./playingcards.TTF);
	}
	.playing-card {
		font-family: PlayingCards;
		width: 250px;
		height: 350px;
	}
</style>
