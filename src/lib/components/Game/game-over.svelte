<script lang="ts">
	import type CardGame from '$lib/classes/CardGame';
	import GameOverIcon from '../SVG/game-over-icon.svelte';
	import Button from '../ui/button/button.svelte';
	import { ArrowLeft, ArrowRight } from 'lucide-svelte';
	import './game.css';
	export let game: CardGame;
	const { game: g } = game;
</script>

{#if $g.final}
	<center>
		<div class="text-8xl font-extrabold text-red-600">
			<GameOverIcon width="250px" height="250px" strokeWidth={0.7} />
			GAME OVER
		</div>
		<div class="grid grid-flow-col">
			<div class="grid grid-flow-row">
				<span class="text-6xl font-extrabold scoreGradient">FINAL SCORE</span>
				<span class="text-5xl font-thin">{$g.final._score}</span>
			</div>
			<div class="grid grid-flow-row">
				<span class="text-6xl font-extrabold timerGradient">FINAL TIME</span>
				<span class="text-5xl font-thin">{Math.ceil($g.final._currentTime)}s</span>
			</div>
		</div>
		<div class="grid grid-flow-col py-4 gap-10">
			<a on:click={() => game.reset()} href={`./${game.level.level - 1}`}
				><ArrowLeft /> <span class="text-xl">Replay Level</span></a
			>
			<a on:click={() => game.reset()} href="/difficulty/2"
				><ArrowRight /><span class="text-xl">Next Level</span></a
			>
		</div>
	</center>
{/if}
