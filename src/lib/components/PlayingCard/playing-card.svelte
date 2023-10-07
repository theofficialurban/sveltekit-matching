<script lang="ts">
	import { writable } from 'svelte/store';
	import { fade } from 'svelte/transition';
	import { tweened } from 'svelte/motion';
	import { quartInOut } from 'svelte/easing';
	import { base } from '$app/paths';
	import playingcard from '../builders/PlayingCard';
	import type { CardState } from '../builders/PlayingCard';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher<{ faceup: number; facedown: number }>();
	export const state: CardState = {
		status: writable('FACEDOWN'),
		rotation: tweened(0, { duration: 1000, easing: quartInOut }),
		flip: () => {
			const { status, rotation } = state;
			if (!$status || cardId === null) return;

			if ($status === 'FACEDOWN') {
				rotation.set(360).then(() => {
					status.set('FACEUP');
					dispatch('faceup', cardId!);
				});
			} else if ($status === 'FACEUP') {
				rotation.set(0).then(() => {
					status.set('FACEDOWN');
					dispatch('facedown', cardId!);
				});
			}
		}
	};
	export let cardId: number | null = null;
	export let cardValue: string | null = null;
	const { rotation, status, flip } = state;

	const key = 1;
</script>

{#if cardId !== null}
	<div class="w-[235px] h-[331px] p-2" use:playingcard={{ flip, rotation: $rotation }}>
		{#if $status === 'FACEDOWN' && $rotation === 0}
			<div out:fade={{ delay: 500 }} in:fade>
				<img src={`${base}/playing-card-235x331.png`} alt="Playing Card" />
			</div>
		{:else if $status === 'FACEUP' && $rotation === 360}
			<div in:fade={{}} out:fade={{ delay: 600 }}><slot /></div>
		{/if}
	</div>
{/if}
