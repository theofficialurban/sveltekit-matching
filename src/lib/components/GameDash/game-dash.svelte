<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { GameStatus } from '$lib/stores/game';
	import type GameManager from '$lib/stores/manager';
	import AdminDashboard from '../Dashboard/admin-dashboard.svelte';
	export let game: GameManager;
	const {
		vitals: { store: vitalsStore },
		timer: { store: timerStore }
	} = game;
	$: status = $vitalsStore._statusString;
	$: score = $vitalsStore._score;
</script>

<Card.Root class="w-[600px] mx-auto">
	<Card.Header class="text-2xl font-extrabold grid grid-flow-col columns-2">
		<span>Game Information</span>
		<span
			class="text-center"
			class:text-red-700={game.vitals.status === GameStatus.NOTSTARTED ||
				game.vitals.status === GameStatus.ERROR}
			class:text-green-500={game.vitals.status === GameStatus.INPROGRESS}>{status}</span
		>
	</Card.Header>
	<Card.Content class="grid grid-flow-col grid-cols-2 text-center">
		<div><span class="time-grad">Second(s) Remaining</span><br />{Math.round($timerStore)}</div>
		<div><span class="score-grad">Current Score</span><br />{score}</div>
	</Card.Content>
	{#if game.settings.controls}
		<Card.Footer>
			<AdminDashboard {game} />
		</Card.Footer>
	{/if}
</Card.Root>

<style>
	.time-grad {
		@apply bg-clip-text text-transparent bg-gradient-to-r from-[#e9d022] to-[#e60b09] text-xl font-bold;
	}
	.score-grad {
		@apply bg-clip-text text-transparent bg-gradient-to-r from-[#0965c0] to-[#c53a94] text-xl font-bold;
	}
</style>
