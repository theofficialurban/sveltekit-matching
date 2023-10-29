<script lang="ts">
	import type CardGame from '$lib/classes/CardGame';
	import type GameTimer from '$lib/classes/GameTimer';
	import CardControls from '../Dashboard/card-controls.svelte';
	import Button from '../ui/button/button.svelte';
	import './banner.css';
	export let game: CardGame;
	const { game: gs, adminControls, reset, timer } = game;
	const { gameTimer, start, stop } = timer;
</script>

<div class="columns-2">
	<div class="score">
		<h2 class="scoreGradient">Score</h2>
		<h2 class="text-center">{$gs.score}</h2>
	</div>
	<div class="timer">
		<h2 class="timerGradient">Seconds</h2>
		<h2 class="text-center">{Math.ceil($gameTimer)}s</h2>
	</div>
</div>
{#if adminControls}
	<div class="cardControls">
		<CardControls {game} /><br />
		<Button on:click={start}>Start</Button><br />
		<Button on:click={stop}>Stop</Button><br />
		<Button on:click={reset}>Reset</Button>
	</div>
{/if}
<div class="bottom">In Progress: {$gs.status}</div>
