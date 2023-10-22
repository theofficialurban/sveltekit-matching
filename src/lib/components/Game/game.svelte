<script lang="ts">
	import { GameStatus } from '$lib/classes/Game';
	import GameVitals from '$lib/stores/game';
	import type GameManager from '$lib/stores/manager';
	import Dashboard from '../Dashboard/dashboard.svelte';
	import CardHand from '../Hand/card-hand.svelte';
	import Timer from '../Timer/timer.svelte';
	import GameOver from './game-over.svelte';
	import NoGame from './no-game.svelte';
	export let game: GameManager;
	const {
		settings: { controls },
		vitals: { store: vitalsStore }
	} = game;
</script>

{GameVitals.resolveStatus($vitalsStore._status)}
<div class="text-3xl text-center">
	<Timer {game} />
</div>
{#if controls}
	<Dashboard {game} />
{/if}
{#if !game}
	Error Initializing Game
{:else if $vitalsStore._status === GameStatus.NOTSTARTED}
	<NoGame {game} />
{:else if $vitalsStore._status === GameStatus.ENDED || $vitalsStore._status === GameStatus.LOSS}
	<GameOver {game} />
{:else}
	<CardHand {game} />
{/if}
