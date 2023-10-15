<script lang="ts">
	import type { Deck } from '$lib/stores/cards';
	import type CardStore from '$lib/stores/cards';
	import type GameTimer from '$lib/stores/timer';
	import type Game from '$lib/stores/game';
	import Dashboard from '../Dashboard/dashboard.svelte';
	import TimerComponent from '../GameTimer/game-timer.svelte';
	import CardHand from '../Hand/card-hand.svelte';
	import type { GameSettings } from './game';
	export let game: Game;
	const {
		hand,
		timer: { store: timeStore },
		controls,
		playSize
	} = game;

	$: gameOver = $timeStore.gameOver;
	// 1) Cards are played when flipped,
</script>

{#if controls}
	<Dashboard {game} />
{/if}
{#if !game}
	Error Initializing Game
{:else}
	<TimerComponent
		on:start={(e) => {
			console.log('Started');
		}}
		on:stop={() => console.log('STOP')}
		on:end={() => console.log('END')}
		class="w-[200px] text-md fixed right-6 bg-black bg-opacity-75 z-50"
		{game}
	/>
	{#if gameOver === 'false' || controls}
		<CardHand
			on:faceup={(e) => {
				if (hand.countFaceUp() >= playSize) return e.preventDefault();
			}}
			on:move={(e) => console.log(e.detail)}
			{game}
		/>
	{/if}
{/if}
