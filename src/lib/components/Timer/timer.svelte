<script lang="ts">
	import { GameStatus } from '$lib/classes/Game';
	import * as Card from '$lib/components/ui/card/index';
	import type GameManager from '$lib/stores/manager';
	import { fly } from 'svelte/transition';

	export let game: GameManager;

	const {
		timer,
		vitals: { store: vitalsStore }
	} = game;
	const { store: timeStore } = timer;

	const { INPROGRESS, WIN, LOSS, ERROR, ENDED } = GameStatus;
</script>

{#if $vitalsStore._status === INPROGRESS || $vitalsStore._status === WIN || $vitalsStore._status === LOSS || $vitalsStore._status === ENDED}
	<div transition:fly={{ duration: 1000 }} class="py-5">
		<Card.Root class="bg-black bg-opacity-10 w-[500px] right-0 top-0 ">
			<Card.Header
				><span
					class="font-extrabold text-3xl bg-gradient-to-r from-[#e91fa8] to-[#2472fc] bg-clip-text text-transparent"
					>Game Information {status}</span
				></Card.Header
			>
			<Card.Content class="text-2xl font-bold grid grid-flow-col">
				<span>{$timeStore} <br /> Seconds</span>
				<span>Score: {$vitalsStore._score}</span>
			</Card.Content>
		</Card.Root>
	</div>
{/if}

<style>
	.error {
		@apply bg-gradient-to-r text-transparent bg-clip-text from-[#ff0f7b] to-[#f89b29] font-extrabold text-2xl;
	}
</style>
