<script lang="ts">
	import CardGame, { Status } from '$lib/classes/CardGame';
	import CardHand from '../CardHand/card-hand.svelte';

	import { onDestroy } from 'svelte';
	import GameBanner from './game-banner.svelte';
	import GameOver from './game-over.svelte';
	import GameHeader from './header/game-header.svelte';
	export let game: CardGame;

	const {
		reset,
		game: gs,
		timer: { gameTimer },
		handler: { play$ }
	} = game;

	onDestroy(() => {
		reset();
	});
</script>

<!-- <GameBanner {game} /> -->
{#if $gs.status === Status.STARTED && $gameTimer > 0}
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
{:else if $gs.status === Status.COMPLETE}
	<GameOver {game} />
{/if}
