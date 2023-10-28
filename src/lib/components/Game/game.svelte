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
	import InPlay from '$lib/classes/InPlay';
	const game = new CardGame({
		pair: true,
		count: 5,
		faceImages: [Face1, Face2, NotPictured],
		cover: Cover,
		adminControls: true
	});
	const { adminControls, reset } = game;
	const timer = new GameTimer(game);
	const { gameTimer } = timer;

	onDestroy(() => {
		reset();
	});
</script>

<div>{$gameTimer}</div>
{#if adminControls}
	<CardControls {timer} {game} />
{/if}

<CardHand on:match={() => console.log('Yay Match')} {game} />
