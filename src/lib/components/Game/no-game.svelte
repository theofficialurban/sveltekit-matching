<script lang="ts">
	import { GameStatus } from '$lib/classes/Game';
	import type GameManager from '$lib/stores/manager';
	import Button from '../ui/button/button.svelte';
	export let game: GameManager;
	const startGame = () => {
		game.vitals.status = GameStatus.INPROGRESS;
		game.hand.shuffle(5).then(() => {
			game.timer.start();
		});
	};
</script>

<div class="text-8xl font-extrabold text-center p-10">TO START, PRESS PLAY</div>
<center
	><Button class="text-3xl bg-green-400 font-extrabold" on:click={startGame} size="lg">PLAY</Button
	></center
>
