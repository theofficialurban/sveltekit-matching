<!-- Allow Getters/Setters -->
<svelte:options accessors={true} />

<script lang="ts">
	import type PlayingCard from '$lib/types/Card';
	import { createEventDispatcher, SvelteComponent } from 'svelte';
	import { base } from '$app/paths';
	import cardflip from './playing-card';
	import { tweened, type Tweened } from 'svelte/motion';
	export class PlayingCardComponent extends SvelteComponent<
		{ state: PlayingCard['State']; _cover: string },
		PlayingCard['Events']['DispatchTypes']
	> {}
	const dispatch = createEventDispatcher<PlayingCard['Events']['DispatchTypes']>();

	/**
	 * @props Playing Card State
	 * @param _id - The unique ID (key) of the card
	 * @param _status - The status (FACEUP | FACEDOWN) of the card
	 * @param _value - The card value
	 * @param _cover - The card cover or design (back)
	 * @param _image - The card image (face)
	 */

	export let _cover: string = `${base}/playing-card-235x331.png`;

	export let state: PlayingCard['State'];
	/**
	 * @param CardSlotClasses
	 * @property card - The classes applied to the body of the card
	 * @property values - The classes applied to the numerical values of the card
	 * @property facedown - The classes applied to the card while facedown
	 */
	export let classes: PlayingCard['Slots']['Classes'] = {
		card: '',
		values: '',
		facedown: ''
	};

	/**
	 * Transitions
	 * @prop rotation - A tween 0 -> 360 which flips the card
	 * @prop fade - -1 -> 1 applied with x^2 allowing a fade at 180 to show the flip of the card
	 */
	const transitions: { rotation: Tweened<number>; fade: Tweened<number> } = {
		rotation: tweened(0, { duration: 1000 }),
		fade: tweened(-1, { duration: 1000 })
	};
	const { rotation, fade } = transitions;
	const handleFlip = () => {
		if (state._status === 'FACEUP') {
			// Flip to face down
			if (dispatch('facedown', { _id: state._id, _value: state._value }, { cancelable: true })) {
				state = { ...state, _status: 'FACEDOWN' };
				dispatch('move', {
					_id: state._id,
					_value: state._value,
					_prevStatus: 'FACEUP',
					_currentStatus: 'FACEDOWN'
				});
			}
		} else if (state._status === 'FACEDOWN') {
			if (dispatch('faceup', { _id: state._id, _value: state._value }, { cancelable: true })) {
				state = { ...state, _status: 'FACEUP' };
				dispatch('move', {
					_id: state._id,
					_value: state._value,
					_prevStatus: 'FACEDOWN',
					_currentStatus: 'FACEUP'
				});
			}
		}
	};
	/* Reactively Check for Status Changes and Rotate / Fade Card Accordingly */
	$: if (state._status === 'FACEDOWN') {
		rotation.set(0);
		fade.set(-1);
	} else if (state._status === 'FACEUP') {
		rotation.set(360);
		fade.set(1);
	}
</script>

<div
	role="button"
	on:click={handleFlip}
	on:keypress
	tabindex={state._id}
	use:cardflip={{ rotation: $rotation, fade: $fade }}
	class={`w-[250px] h-[350px] relative text-black playing-card p-3 ${classes.card}`}
>
	{#if $rotation > 180}
		<div class="">
			<img class="rounded-xl" src={state._image} alt="card" />
			<span class="bottom-0.5 p-6 absolute font-extrabold">ID: {state._id}</span>
			<span
				class={`top-0 left-0 absolute p-6 text-3xl text-red-600 font-extrabold ${classes.values}`}
				>{state._value}</span
			>
			<span
				class={`top-0 right-0 absolute p-6 text-3xl text-red-600 font-extrabold ${classes.values}`}
				>{state._value}</span
			>
			<span class="right-0 bottom-0 p-6 absolute font-extrabold">{state._status}</span>
		</div>
	{:else if $rotation <= 180}
		<img
			class={`rounded-xl object-contain ${classes.facedown}`}
			src={_cover}
			alt={`Card${state._id}`}
		/>
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
