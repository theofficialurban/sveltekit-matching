<svelte:options accessors={true} />

<script lang="ts">
	import type { CardEvents, CardSlotClasses, CardState, Status } from './card';
	import { createEventDispatcher } from 'svelte';
	import { base } from '$app/paths';
	import { tweened, type Tweened } from 'svelte/motion';
	import flipper from './cardflip';
	import { crossfade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	const dispatch = createEventDispatcher<CardEvents>();
	const [send, recieve] = crossfade({ duration: 1000 });
	const transition: { rotation: Tweened<number>; fade: Tweened<number> } = {
		rotation: tweened(0, { duration: 1000 }),
		fade: tweened(-1, { duration: 1000 })
	};
	const { rotation, fade } = transition;
	export let _id: number;
	export let _status: Status = 'FACEDOWN';
	export let _value: number;
	export let _cover: string = `${base}/playing-card-235x331.png`;
	export let _image: string =
		'https://academics.otc.edu/media/uploads/sites/35/2015/10/not-pictured-250x350.png';
	export const state: CardState = { _id, _status, _value, _image };
	export let classes: CardSlotClasses = {
		card: 'w-[250px] h-[350px] relative text-black playing-card p-3',
		values: 'p-6 text-3xl text-red-600 font-extrabold',
		facedown: ' object-contain'
	};

	$: if (_status === 'FACEDOWN') {
		Promise.allSettled([rotation.set(0), fade.set(-1)]).then(() => {
			dispatch('reveal', state);
		});
	} else if (_status === 'FACEUP') {
		Promise.allSettled([rotation.set(360), fade.set(1)]).then(() => {
			dispatch('cover', state);
		});
	}
</script>

<div
	role="button"
	on:click
	on:keypress
	tabindex={_id}
	use:flipper={{ rotation: $rotation, fade: $fade }}
	class={classes.card}
>
	{#if $rotation > 180}
		<div class="">
			<img class="rounded-xl" src={_image} alt="card" />
			<span class="bottom-0.5 p-6 absolute font-extrabold">ID: {_id}</span>
			<span class={`top-0 left-0 absolute ${classes.values}`}>{_value}</span>
			<span class={`top-0 right-0 absolute ${classes.values}`}>{_value}</span>
			<span class="right-0 bottom-0 p-6 absolute font-extrabold">{_status}</span>
		</div>
	{:else if $rotation <= 180}
		<img class={classes.facedown} src={_cover} alt={`Card${_id}`} />
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
