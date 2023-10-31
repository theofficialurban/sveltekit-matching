<script lang="ts">
	import type CardGame from '$lib/classes/CardGame';

	import Icon from '$lib/components/SVG/icon.svelte';

	import { quadInOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';

	export let game: CardGame;
	const {
		level: { level }
	} = game;
</script>

<div>
	<center class="grid grid-flow-col justify-evenly">
		<div>
			<svelte:component this={Icon} width="500px" height="500px" />
		</div>

		<div class="text-center font-extrabold grid grid-flow-row-dense">
			<span class="text-md">Welcome To....</span>
			<span class="text-8xl level">LEVEL {level}</span>
		</div>
	</center>
</div>

<style>
	.level {
		@apply text-transparent bg-clip-text bg-gradient-to-r from-[var(--from)] to-[var(--to)];
	}
</style>
