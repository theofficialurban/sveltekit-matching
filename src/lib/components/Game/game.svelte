<script lang="ts">
	import CardGame, { Status } from '$lib/classes/CardGame';
	import CardHand from '../CardHand/card-hand.svelte';

	import { onDestroy } from 'svelte';
	import GameOver from './game-over.svelte';
	import GameHeader from './header/game-header.svelte';
	import { scale } from 'svelte/transition';
	import { quadInOut } from 'svelte/easing';
	import LevelScreen from './level/level-screen.svelte';
	export let game: CardGame;
	$: gameTimer = game.timer.gameTimer;
	$: gs = game.game;
	onDestroy(() => {
		game.reset();
	});
</script>

{#key game}
	{#if $gs.status === Status.STARTED && $gameTimer > 0}
		<div
			in:scale|global={{ duration: 500, delay: 550, easing: quadInOut }}
			out:scale|global={{ duration: 500, easing: quadInOut }}
		>
			<GameHeader {game} />
			<CardHand
				on:match={({ detail }) => {
					const { one, two } = detail;
					if (one && two) {
						$gs.score += 2;
						one.remove();
						two.remove();
						game.handler.play$('match');
					}
				}}
				{game}
			/>
		</div>
	{:else if $gs.status === Status.COMPLETE}
		<div
			in:scale|global={{ duration: 500, delay: 550, easing: quadInOut }}
			out:scale|global={{ duration: 500, easing: quadInOut }}
		>
			<GameOver {game} />
		</div>
	{:else if $gs.status === Status.STOPPED}
		<div
			in:scale|global={{ duration: 500, delay: 550, easing: quadInOut }}
			out:scale|global={{ duration: 500, easing: quadInOut }}
		>
			<LevelScreen --from={game.level.color.from} --to={game.level.color.to} {game} /><br />
		</div>
	{/if}
{/key}
