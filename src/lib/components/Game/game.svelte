<script lang="ts">
	import type { Deck } from '$lib/stores/cards';
	import type CardStore from '$lib/stores/cards';
	import type GameTimer from '$lib/stores/timer';
	import type Game from '$lib/stores/game';
	import Dashboard from '../Dashboard/dashboard.svelte';
	import TimerComponent from '../GameTimer/game-timer.svelte';
	import CardHand from '../Hand/card-hand.svelte';
	import type { GameSettings } from './game';
	export let game: Game;
	const {
		hand,
		timer: { store: timeStore },
		controls,
		playSize
	} = game;
	const { store: cardStore } = hand;
	$: gameOver = $timeStore.gameOver;
	// 1) Cards are played when flipped,
</script>

{game.gameWon}
{#if controls}
	<Dashboard {game} />
{/if}
{#if !game}
	Error Initializing Game
{:else}
	<TimerComponent
		on:start={(e) => {
			console.log('Started');
		}}
		on:stop={() => console.log('STOP')}
		on:end={() => console.log('END')}
		class="w-[200px] text-md fixed right-6 bg-black bg-opacity-75 z-50"
		{game}
	/>
	{#if gameOver === 'false' || controls}
		<CardHand
			on:faceup={(e) => {
				if (game.playCard(e.detail)) {
					console.log(game.played.cards());
				}
				if (hand.countFaceUp() >= playSize) {
					hand.coverAll();
					game.resetPlayed();
					return e.preventDefault();
				}
			}}
			on:facedown={(e) => {
				if (game.c1 !== -1) {
					if (game.c1._id === e.detail._id) game.resetPlayed(1);
				}
				if (game.c2 !== -1) {
					if (game.c2._id === e.detail._id) game.resetPlayed(2);
				}
				console.log(game.played.cards());
			}}
			on:move={(e) => {
				if (game.played.count() === 2) {
					game.gameResult().then((tf) => {
						console.log(tf);
						const c1 = game.c1 !== -1 ? game.c1._id : null;
						const c2 = game.c2 !== -1 ? game.c2._id : null;
						console.log(`${c1} ${c2}`);
						if (tf === true) {
							game.resetPlayed();
							hand.removePair([c1, c2]);
							if ($cardStore.length === 0) {
								game.gameWon = true;
							}
						}
					});
				}
			}}
			{game}
		/>
	{/if}
{/if}
