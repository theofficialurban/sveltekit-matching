<script lang="ts">
	import type CardGame from '$lib/classes/CardGame';
	import './game.css';
	export let game: CardGame;
	const { game: g } = game;
</script>

{#if $g.final}
	<center>
		<div class="text-8xl font-extrabold text-red-600">GAME OVER</div>
		<div class="grid grid-flow-col">
			<div class="grid grid-flow-row">
				<span class="text-6xl font-extrabold scoreGradient">FINAL SCORE</span>
				<span class="text-5xl font-thin">{$g.final._score}</span>
			</div>
			<div class="grid grid-flow-row">
				<span class="text-6xl font-extrabold timerGradient">FINAL TIME</span>
				<span class="text-5xl font-thin">{$g.final._currentTime}s</span>
			</div>
		</div>
	</center>
{/if}
