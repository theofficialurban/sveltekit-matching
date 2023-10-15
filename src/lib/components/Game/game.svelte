<script lang="ts">
	import type CardStore from '$lib/stores/cards';
	import type GameTimer from '$lib/stores/timer';
	import Dashboard from '../Dashboard/dashboard.svelte';
	import TimerComponent from '../GameTimer/game-timer.svelte';
	import CardHand from '../Hand/card-hand.svelte';
	export let hand: CardStore;
	export let timer: GameTimer;
	export let controls: boolean = false;
	const { store: timeStore } = timer;

	let gameStatus: 'true' | 'false' | 'notstarted';
	$: gameStatus = $timeStore.gameOver;
</script>

{#if !hand || !timer}
	Error Initializing Game
{:else}
	<TimerComponent class="w-[200px] text-md fixed right-6 bg-black bg-opacity-75 z-50" {timer} />
	{#if $timeStore.gameOver === 'false' || controls}
		<CardHand {hand} />
	{/if}
{/if}
{#if controls}
	<Dashboard {hand} {timer} />
{/if}
