<script lang="ts">
	import type Game from '$lib/classes/Game';
	import { PlayHandler } from '$lib/classes/Game';
	import Dashboard from '../Dashboard/dashboard.svelte';
	import TimerComponent from '../GameTimer/game-timer.svelte';
	import CardHand from '../Hand/card-hand.svelte';
	export let game: Game;
	const { playSize } = game;
	game.gameHandlers.faceup = PlayHandler((detail, type, preventDefault) => {
		if (type !== 'faceup') return;
		if (game.hand.countFaceUp() === 2) return preventDefault();
		if (game.hand.countFaceUp() !== game.cardsPlayed.count) return preventDefault();
		if (game.cardsPlayed.makePlay({ _id: detail._id, _value: detail._value })) {
			if (game.cardsPlayed.count === 2) {
				game
					.gameResult()
					.then(({ one, two }) => {
						game.hand.removeCards(one._id, two._id);
						game.cardsPlayed.reset();
					})
					.catch(() => setTimeout(() => game.cardsPlayed.reset(true), 1000));
			}
		} else {
			if (game.cardsPlayed.count === 2) {
				game.cardsPlayed.reset();
				preventDefault();
				return;
			}
		}
	});
	game.gameHandlers.facedown = PlayHandler((detail, type) => {
		if (type !== 'facedown') return;
		try {
			game.cardsPlayed.removePlay(detail._id);
		} catch (error) {
			console.error(error);
		}
		console.table(game.cardsPlayed.current);
	});
	const {
		gameWon,
		timer: { store: timerStore },
		controls,
		cardsPlayed: { removePlay },
		handlers: {
			game: { handleFaceDown, handleFaceUp, handleMove },
			timer: { handleEnd, handleStart, handleStop }
		}
	} = game;
</script>

<div class="text-3xl text-center">
	Game Won Status: <span class=" text-teal-500">{gameWon}</span>
</div>
{#if controls}
	<Dashboard {game} />
{/if}
{#if !game}
	Error Initializing Game
{:else}
	<TimerComponent
		on:start={handleStart}
		on:stop={handleStop}
		on:end={handleEnd}
		class="w-[200px] text-md fixed right-6 bg-black bg-opacity-75 z-50"
		{game}
	/>
	{#if $timerStore.gameOver === 'false' || controls}
		<CardHand on:faceup={handleFaceUp} on:facedown={handleFaceDown} on:move={handleMove} {game} />
	{/if}
{/if}
