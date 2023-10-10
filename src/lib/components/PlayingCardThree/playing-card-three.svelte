<svelte:options accessors={true} />

<script lang="ts">
	import type { Status } from './card';
	import { createEventDispatcher } from 'svelte';
	import { base } from '$app/paths';
	import { tweened, type Tweened } from 'svelte/motion';
	const dispatch = createEventDispatcher<{
		reveal: { _id: number; _value?: any };
		cover: { _id: number; _value?: any };
		initflip: { _id: number; _value?: any };
	}>();
	type Transition = { rotation: number; fade: number };
	const transition: { rotation: Tweened<number>; fade: Tweened<number> } = {
		rotation: tweened(0, { duration: 1000 }),
		fade: tweened(-1, { duration: 1000 })
	};
	const { rotation, fade } = transition;
	export let state: {
		_id: number;
		_value?: any;
		_status: Status;
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
	const flipper = (node: HTMLElement, options: Transition) => {
		return {
			update({ rotation, fade }: Transition) {
				let styles = `opacity: ${fade * fade * 100}%; transform: rotate3d(0,1,0,${rotation}deg);`;
				node.setAttribute('style', styles);
			}
		};
	};
</script>

<div
	role="button"
	on:click={flip}
	on:keypress
	tabindex={state._id}
	use:flipper={{ rotation: $rotation, fade: $fade }}
	class=" bg-white text-black playing-card overflow-hidden"
>
	{#if $rotation > 180}
		<div class="w-[250px] h-[350px]">
			<div class="w-[250px] h-[350px]">
				<slot />
			</div>
			<span class="bottom-0.5 p-2 fixed font-extrabold">ID: {state._id}</span>
			<span class="top-0 left-0 fixed p-2 text-red-600 font-extrabold">{state._value}</span>
			<span class="top-0 right-0 fixed p-2 text-red-600 font-extrabold">{state._value}</span>
			<span class="right-0 bottom-0 fixed p-2 font-extrabold">{state._status}</span>
		</div>
	{:else if $rotation <= 180}
		<img
			class="w-[250px] h-[350px]"
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
	}
</style>
