<!-- Allow Getters/Setters -->
<svelte:options accessors={true} />

<script lang="ts">
	import type { CardEvents, CardSlotClasses, PlayingCard, Status } from './card';
	import { createEventDispatcher } from 'svelte';
	import { base } from '$app/paths';
	import transitions, { cardflip } from './playing-card';
	const dispatch = createEventDispatcher<CardEvents>();
	const { rotation, fade } = transitions;

	/**
	 * @props Playing Card State
	 * @param _id - The unique ID (key) of the card
	 * @param _status - The status (FACEUP | FACEDOWN) of the card
	 * @param _value - The card value
	 * @param _cover - The card cover or design (back)
	 * @param _image - The card image (face)
	 */
	export let _id: number;
	export let _status: Status = 'FACEDOWN';
	export let _value: number;
	export let _cover: string = `${base}/playing-card-235x331.png`;
	export let _image: string =
		'https://academics.otc.edu/media/uploads/sites/35/2015/10/not-pictured-250x350.png';
	const state: PlayingCard = { _id, _status, _value, _image };
	/**
	 * @param CardSlotClasses
	 * @property card - The classes applied to the body of the card
	 * @property values - The classes applied to the numerical values of the card
	 * @property facedown - The classes applied to the card while facedown
	 */
	export let classes: CardSlotClasses = {
		card: '',
		values: '',
		facedown: ''
	};

	/* Reactively Check for Status Changes and Rotate / Fade Card Accordingly */
	$: if (_status === 'FACEDOWN') {
		Promise.allSettled([rotation.set(0), fade.set(-1)]).then(() => {
			dispatch('facedown', state);
		});
	} else if (_status === 'FACEUP') {
		Promise.allSettled([rotation.set(360), fade.set(1)]).then(() => {
			dispatch('faceup', state);
		});
	}
</script>

<div
	role="button"
	on:click
	on:keypress
	tabindex={_id}
	use:cardflip={{ rotation: $rotation, fade: $fade }}
	class={`w-[250px] h-[350px] relative text-black playing-card p-3 ${classes.card}`}
>
	{#if $rotation > 180}
		<div class="">
			<img class="rounded-xl" src={_image} alt="card" />
			<span class="bottom-0.5 p-6 absolute font-extrabold">ID: {_id}</span>
			<span
				class={`top-0 left-0 absolute p-6 text-3xl text-red-600 font-extrabold ${classes.values}`}
				>{_value}</span
			>
			<span
				class={`top-0 right-0 absolute p-6 text-3xl text-red-600 font-extrabold ${classes.values}`}
				>{_value}</span
			>
			<span class="right-0 bottom-0 p-6 absolute font-extrabold">{_status}</span>
		</div>
	{:else if $rotation <= 180}
		<img class={`rounded-xl object-contain ${classes.facedown}`} src={_cover} alt={`Card${_id}`} />
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
