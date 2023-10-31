<script lang="ts">
	import type CardGame from '$lib/classes/CardGame';
	import * as Card from '$lib/components/ui/card';
	import { fade } from 'svelte/transition';
	import '../game.css';
	export let game: CardGame;

	const {
		game: g,
		timer: { gameTimer }
	} = game;
</script>

<div class="bg-opacity-20 z-20 fixed left-[8rem] top-4" transition:fade>
	<center>
		<div class="text-center justify-evenly grid grid-flow-col gap-20">
			<Card.Root class="">
				<Card.Content class=" align-middle pt-3">
					<div class="grid grid-flow-col gap-10">
						<div class="grid grid-flow-row">
							<span class="scoreGradient">SCORE</span>
							<span class="text-2xl font-thin">{$g.score}</span>
						</div>
						<div class="grid grid-flow-row">
							<span class="timerGradient">TIMER</span>
							<span class="text-2xl font-thin">{Math.ceil($gameTimer)}s</span>
						</div>
					</div>
				</Card.Content>
			</Card.Root>
		</div>
	</center>
</div>
