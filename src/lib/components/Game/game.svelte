<script lang="ts">
	import CardGame, { Status } from '$lib/classes/CardGame';
	import CardHand from '../CardHand/card-hand.svelte';

	import { onDestroy } from 'svelte';
	import GameBanner from './game-banner.svelte';
	import GameOver from './game-over.svelte';
	import GameHeader from './header/game-header.svelte';
	import { scale } from 'svelte/transition';
	import { quadInOut } from 'svelte/easing';
	import LevelScreen from './level/level-screen.svelte';
	export let game: CardGame;

	const {
		reset,
		game: gs,
		timer: { gameTimer },
		handler: { play$ },
		level: { color }
	} = game;

	onDestroy(() => {
		reset();
	});
</script>

<!-- <GameBanner {game} /> -->
{#if $gs.status === Status.STARTED && $gameTimer > 0}
	<div transition:scale|global={{ duration: 500, delay: 550, easing: quadInOut }}>
		<GameHeader {game} />
		<CardHand
			on:match={({ detail }) => {
				const { one, two } = detail;
				if (one && two) {
					$gs.score += 2;
					one.remove();
					two.remove();
					play$('match');
				}
			}}
			{game}
		/>
	</div>
{:else if $gs.status === Status.COMPLETE}
	<div transition:scale|global={{ duration: 500, delay: 250, easing: quadInOut }}>
		<GameOver {game} />
	</div>
{:else if $gs.status === Status.STOPPED}
	<div transition:scale|global={{ duration: 500, delay: 550, easing: quadInOut }}>
		<LevelScreen --from={color.from} --to={color.to} {game} />
	</div>
{/if}
