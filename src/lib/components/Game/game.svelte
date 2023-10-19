<script lang="ts">
	import type Game from '$lib/classes/Game';
	import { resolveStatus } from '$lib/classes/Game';
	import Dashboard from '../Dashboard/dashboard.svelte';
	import CardHand from '../Hand/card-hand.svelte';
	import {
		handleFaceUp as faceUpCallback,
		handleFaceDown as faceDownCallback
	} from './callbacks/game';
	export let game: Game;
	game.setHandler('faceup', faceUpCallback);
	game.setHandler('facedown', faceDownCallback);
	const {
		gameStatus,
		controls,
		handlers: {
			game: { handleFaceDown, handleFaceUp, handleMove }
		}
	} = game;
</script>

<div class="text-3xl text-center">
	Game Won Status: <span class=" text-teal-500">{resolveStatus(gameStatus)}</span>
</div>
{#if controls}
	<Dashboard {game} />
{/if}
{#if !game}
	Error Initializing Game
{:else}
	<CardHand on:faceup={handleFaceUp} on:facedown={handleFaceDown} on:move={handleMove} {game} />
{/if}
