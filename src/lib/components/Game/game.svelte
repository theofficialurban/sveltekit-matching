<script lang="ts">
	import CardGame from '$lib/classes/CardGame';
	import CardHand from '../CardHand/card-hand.svelte';
	import NotPictured from '$lib/assets/not-pictured.png';
	import Face1 from '$lib/assets/card-face.png';
	import Face2 from '$lib/assets/card2.png';
	import Cover from '$lib/assets/card-cover.png';
	import CardControls from '../Dashboard/card-controls.svelte';
	import { onDestroy } from 'svelte';
	import GameTimer from '$lib/classes/GameTimer';
	const game = new CardGame({
		pair: true,
		count: 5,
		faceImages: [Face1, Face2, NotPictured],
		cover: Cover,
		adminControls: true
	});

	const { adminControls, reset, score } = game;
	const timer = new GameTimer(game);
	const { gameTimer } = timer;

	onDestroy(() => {
		reset();
	});
</script>

<div>{Math.ceil($gameTimer)}</div>

<div>{$score}</div>
{#if adminControls}
	<CardControls {timer} {game} />
{/if}

<CardHand
	on:match={({ detail }) => {
		const { one, two } = detail;
		if (one && two) {
			$score += 2;
			one.remove();
			two.remove();
			game.eventLogger.logEvent('match', {
				_currentTime: Math.ceil($gameTimer),
				_cards: detail,
				_cardsRemaining: game.deck.getDeckCounts().total,
				_score: $score
			});
		}
	}}
	{game}
/>
