<script lang="ts">
	import { base } from '$app/paths';
	import type { CardState, ComponentState, Status } from '$lib/stores/cards';
	import { createEventDispatcher } from 'svelte';
	import { flipper } from '../builders/PlayingCard';
	import { blur } from 'svelte/transition';
	const dispatch = createEventDispatcher();
	export let state: ComponentState;
	let className = '';
	export { className as class };
	export const flip = () => {
		return new Promise<number>((resolve, reject) => {
			const lastStatus = state.status;
			if (lastStatus === 'FACEDOWN') {
				state.status = 'FACEUP';
				dispatch('faceup');
				resolve(state.id);
			} else if (lastStatus === 'FACEUP') {
				state.status = 'FACEDOWN';
				dispatch('facedown');
				resolve(state.id);
			}
			reject();
		});
	};
</script>

<div
	id={state.id.toString()}
	class="aspect-[2.5/3.5] mx-auto p-2"
	role="button"
	tabindex={state.id}
	use:flipper={state.status}
	on:click={flip}
	on:keydown
>
	{#if state.status === 'FACEDOWN'}
		<img
			class="mx-auto aspect-[2.5/3.5]"
			src={`${base}/playing-card-235x331.png`}
			alt="Playing Card"
		/>
	{:else if state.status === 'FACEUP'}
		<div class={`mx-auto aspect-[2.5/3.5] ${className}`}>
			<slot />
		</div>
	{/if}
</div>
