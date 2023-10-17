<script lang="ts">
	import type Game from '$lib/classes/Game';
	import Dashboard from '../Dashboard/dashboard.svelte';
	import TimerComponent from '../GameTimer/game-timer.svelte';
	import CardHand from '../Hand/card-hand.svelte';
	import {
		handleFaceUp as faceUpCallback,
		handleFaceDown as faceDownCallback
	} from './callbacks/game';
	export let game: Game;
	game.setHandler('faceup', faceUpCallback);
	game.setHandler('facedown', faceDownCallback);
	const {
		gameWon,
		timer: { store: timerStore },
		controls,
		handlers: {
			timer: { handleEnd, handleStart, handleStop },
			game: { handleFaceDown, handleFaceUp, handleMove }
		}
	} = game;
</script>

<div class="text-3xl text-center">
	Game Won Status: <span class=" text-teal-500">{gameWon}</span>
</div>
{#if controls}
	<Dashboard {game} />
{/if}
{#if !game}
	Error Initializing Game
{:else}
	<TimerComponent
		on:start={handleStart}
		on:stop={handleStop}
		on:end={handleEnd}
		class="w-[200px] text-md fixed right-6 bg-black bg-opacity-75 z-50"
		{game}
	/>
	{#if $timerStore.gameOver === 'false' || controls}
		<CardHand on:faceup={handleFaceUp} on:facedown={handleFaceDown} on:move={handleMove} {game} />
	{/if}
{/if}
