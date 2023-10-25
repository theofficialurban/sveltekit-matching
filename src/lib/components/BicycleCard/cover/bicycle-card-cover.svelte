<script lang="ts">
	import type BicycleCard from '$lib/types/BicycleCard';
	import { SvelteComponent } from 'svelte';
	export class BicycleCardCover extends SvelteComponent<
		{ store: BicycleCard['Store']; class: string },
		{},
		{}
	> {}
	export let store: BicycleCard['Store'];
	const className: string = '';
	export { className as class };
</script>

<img
	class={`rounded-xl object-contain ${className}`}
	src={$store._cover}
	alt={`Card${$store._id}`}
/>
