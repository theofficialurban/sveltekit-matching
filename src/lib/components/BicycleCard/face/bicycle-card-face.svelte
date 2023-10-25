<script lang="ts">
	import type BicycleCard from '$lib/types/BicycleCard';
	import { SvelteComponent } from 'svelte';
	export class BicycleCardFace extends SvelteComponent<
		{ store: BicycleCard['Store']; class: string },
		{},
		{}
	> {}
	export let store: BicycleCard['Store'];
	const className: string = '';
	export { className as class };
</script>

<div class={className}>
	<img class="rounded-xl" src={$store._image} alt="card" />
	<span class={`top-0 left-0 absolute p-6 text-3xl text-red-600 font-extrabold`}>
		<slot name="value-l">
			{$store._value}
		</slot>
	</span>
	<span class={`top-0 right-0 absolute p-6 text-3xl text-red-600 font-extrabold`}>
		<slot name="value-r">
			{$store._value}
		</slot>
	</span>
	<span class="bottom-0.5 p-6 absolute font-extrabold">
		<slot name="bottom-l">
			ID: {$store._id}
		</slot>
	</span>
	<span class="right-0 bottom-0 p-6 absolute font-extrabold">
		<slot name="bottom-r">
			{$store._status}
		</slot>
	</span>
</div>
