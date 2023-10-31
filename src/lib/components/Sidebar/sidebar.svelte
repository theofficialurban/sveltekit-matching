<script lang="ts">
	import type CardGame from '$lib/classes/CardGame';
	import CardControls from '../Dashboard/card-controls.svelte';

	import Icon from '../SVG/icon.svelte';
	import Button from '../ui/button/button.svelte';
	export let game: CardGame;
	const {
		timer: { start, stop },
		reset,
		isAdmin
	} = game;
</script>

<div class="fixed left-0 w-[85px] bg-[#191c1f] h-[100%]">
	<center>
		<span class="p-3 w-[75px] h-[75px] justify-start">
			<Icon />
		</span>
		<div class="grid grid-flow-row gap-20 px-4 justify-start">
			<Button on:click={start}>▶️</Button>
			<Button on:click={reset}>⏹️</Button>
			{#if isAdmin()}
				<CardControls {game} />
			{/if}
		</div>
	</center>
</div>
