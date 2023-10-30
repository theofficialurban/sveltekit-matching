<script lang="ts">
	import type CardGame from '$lib/classes/CardGame';
	import CardControls from '../Dashboard/card-controls.svelte';
	import Button from '../ui/button/button.svelte';
	import './banner.css';
	export let game: CardGame;
	const { game: gs, adminControls, reset, timer } = game;
	const { gameTimer, start, stop } = timer;
</script>

<div class="columns-2 pt-4">
	<div class="score">
		<slot name="score"
			><h2 class="scoreGradient">Score</h2>
			<h2 class="text-center">{$gs.score}</h2></slot
		>
	</div>
	<slot name="timer">
		<div class="timer">
			<h2 class="timerGradient">Seconds</h2>
			<h2 class="text-center">{Math.ceil($gameTimer)}s</h2>
		</div>
	</slot>
</div>
<div class="">
	<div class="absolute top-0 left-0 p-4 w-[100px] h-screen grid grid-flow-row">
		{#if adminControls}
			<CardControls {game} /><br />
		{/if}
		<Button on:click={start}>Start</Button><br />
		<Button on:click={stop}>Stop</Button><br />
		<Button on:click={reset}>Reset</Button>
	</div>
</div>

<div class="bottom">In Progress: {$gs.status}</div>
