<script lang="ts">
	import type GameManager from '$lib/stores/manager';
	import Button from '../ui/button/button.svelte';

	export let game: GameManager;
	const {
		vitals: { store: vitalsStore }
	} = game;
</script>

<div class="text-3xl font-extrabold text-center">FINAL SCORE {$vitalsStore._score}</div>
<div class="text-8xl font-extrabold text-center p-10">TO RESTART, PRESS RESTART</div>
<center
	><Button on:click={() => game.resetAll()} class="text-3xl bg-orange-400 font-extrabold" size="lg"
		>RESTART</Button
	></center
>
