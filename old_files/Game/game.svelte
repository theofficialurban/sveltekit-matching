<script lang="ts">
	import type GameManager from '$lib/stores/manager';
	import { onDestroy } from 'svelte';
	import GameDash from '../GameDash/game-dash.svelte';
	import CardHand from '../Hand/card-hand.svelte';
	import GameOver from './game-over.svelte';
	import NoGame from './no-game.svelte';
	import { GameStatus } from '$lib/stores/game';
	export let game: GameManager;
	const {
		settings: { controls },
		vitals: { store: vitalsStore }
	} = game;
	onDestroy(() => {
		game.resetAll();
	});
</script>

{#if controls}
	<GameDash {game} />
{/if}
{#if !game}
	Error Initializing Game
{:else if $vitalsStore._status === GameStatus.NOTSTARTED}
	<NoGame {game} />
{:else if $vitalsStore._status === GameStatus.ENDED}
	<GameOver {game} />
{:else}
	<CardHand {game} />
{/if}
