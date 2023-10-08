<script lang="ts">
	import { fade } from 'svelte/transition';
	import { tweened, type Tweened } from 'svelte/motion';
	import { quartInOut } from 'svelte/easing';
	import { base } from '$app/paths';
	import playingcard from '../builders/PlayingCard';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher<{ faceup: number; facedown: number}>();
	
		
		
	export const newFlip = () => {
		return new Promise((resolve, reject) => {
			if (!cardStatus || cardId === null) return reject("Initial Error");

			if (cardStatus === 'FACEDOWN') {
				cardStatus = 'FLIPPING'
				return rotation.set(360).then(() => {
					cardStatus ='FACEUP'
					dispatch('faceup', cardId!);
					return resolve('faceup');
				})
			} else if (cardStatus === 'FACEUP') {
				cardStatus = 'FLIPPING'
				return rotation.set(0).then(() => {
					cardStatus ='FACEDOWN'
					dispatch('facedown', cardId!);
					return resolve('facedown')
				});
			}
		});
	}
	export const flip: () => void = () => {
			if (!cardStatus || cardId === null) return;

			if (cardStatus === 'FACEDOWN') {
				cardStatus = 'FLIPPING'
				return rotation.set(360).then(() => {
					cardStatus ='FACEUP'
					dispatch('faceup', cardId!);
				})
			} else if (cardStatus === 'FACEUP') {
				cardStatus = 'FLIPPING'
				return rotation.set(0).then(() => {
					cardStatus ='FACEDOWN'
					dispatch('facedown', cardId!);
				});
			}
		}
	export const rotation = tweened(0, { duration: 1000, easing: quartInOut });
	export let cardId: number | null = null;
	export let cardStatus:'FACEDOWN' | 'FACEUP' | 'FLIPPING' = 'FACEDOWN'
	export let cardValue: string | null = null;

</script>
<svelte:options accessors={true} />
{#if cardId !== null}
	<div class="w-[235px] h-[331px] p-2" on:click on:keypress tabindex={cardId} role='button' use:playingcard={{ rotation: $rotation }}>
		{#if cardStatus === 'FACEDOWN' && $rotation === 0}
			<div out:fade={{ delay: 500 }}>
				<img src={`${base}/playing-card-235x331.png`} alt="Playing Card" />
			</div>
		{:else if cardStatus === 'FACEUP' && $rotation === 360}
			<div out:fade={{ delay: 500 }}><slot /></div>
		{/if}
	</div>
{/if}
