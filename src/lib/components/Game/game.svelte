<script lang="ts">
	import CardGame, { Status } from '$lib/classes/CardGame';
	import CardHand from '../CardHand/card-hand.svelte';
	import NotPictured from '$lib/assets/not-pictured.png';
	import Face1 from '$lib/assets/card-face.png';
	import Face2 from '$lib/assets/card2.png';
	import Cover from '$lib/assets/card-cover.png';
	import { onDestroy } from 'svelte';
	import GameBanner from './game-banner.svelte';
	import GameOver from './game-over.svelte';
	const game = new CardGame({
		pair: true,
		count: 5,
		faceImages: [Face1, Face2, NotPictured],
		cover: Cover,
		adminControls: true
	});

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

<GameBanner {game} />
{#if $gs.status === Status.STARTED && $gameTimer > 0}
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
	<GameOver />
{/if}
