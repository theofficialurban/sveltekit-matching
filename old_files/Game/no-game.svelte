<script lang="ts">
	import type GameManager from '$lib/stores/manager';
	import { GameNotifs } from '$lib/stores/manager';

	import Button from '../ui/button/button.svelte';
	export let game: GameManager;
	const s = game.notifications;
	const startGame = () => s.next({ status: GameNotifs.START });
</script>

<div class="text-8xl font-extrabold text-center p-10">TO START, PRESS PLAY</div>
<center
	><Button class="text-3xl bg-green-400 font-extrabold" on:click={startGame} size="lg">PLAY</Button
	></center
>
