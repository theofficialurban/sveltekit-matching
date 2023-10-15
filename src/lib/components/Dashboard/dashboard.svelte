<script lang="ts">
	import Button from '../ui/button/button.svelte';
	import * as Accordion from '../ui/accordion/index';
	import * as Dialog from '$components/ui/dialog';
	import type Game from '$lib/stores/game';
	export let game: Game;
	const { hand, timer } = game;
	const { store: timerStore } = timer;
	const { store: cardStore, pairs } = hand;
</script>

<Dialog.Root>
	<Dialog.Trigger>
		<Button variant="secondary">🃏 Card Controls</Button>
	</Dialog.Trigger>
	<Dialog.Content class="grid grid-rows-2 gap-4 w-max">
		<div class="container">
			<Button on:click={() => hand.shuffle(3)} variant="secondary">Shuffle</Button>
			<Button on:click={() => hand.coverAll()} variant="secondary">Cover All</Button>
			<Button on:click={() => hand.revealAll()} variant="secondary">Reveal All</Button>
			<Button on:click={() => hand.newHand()} variant="secondary">New Hand</Button>
			<Button on:click={() => alert(hand.countFaceUp())}>Count Face Up</Button>
			<Button on:click={() => game.startGame()}>Start Game</Button>
		</div>

		<Accordion.Root>
			<Accordion.Item value="1">
				<Accordion.Trigger>All Cards</Accordion.Trigger>
				<Accordion.Content>
					<ol>
						{#each $cardStore as card, i (card._id)}
							<li class="text-lg">
								<span class="text-red-600">Card {card._id}</span>
								<span class="text-blue-600">|{card._value}|</span>
								- {card._status}
							</li>
						{/each}
					</ol>
				</Accordion.Content>
			</Accordion.Item>
			<Accordion.Item value="2">
				<Accordion.Trigger>Card Pairs</Accordion.Trigger>
				<Accordion.Content>
					<ol>
						{#each pairs as [val, [c1, c2]]}
							<li><span class="text-lg text-red-600 font-bold">{val}</span> - {c1} {c2}</li>
						{/each}
					</ol>
				</Accordion.Content>
			</Accordion.Item>
			<Accordion.Item value="3">
				<Accordion.Trigger>Game Played Cards</Accordion.Trigger>
				<Accordion.Content>
					{JSON.stringify(game.played.cards())}
				</Accordion.Content>
			</Accordion.Item>
		</Accordion.Root>
	</Dialog.Content>
</Dialog.Root>

<Dialog.Root>
	<Dialog.Trigger>
		<Button variant="destructive">⏳ Timer Controls</Button>
	</Dialog.Trigger>
	<Dialog.Content class="grid grid-rows-2 gap-4 w-max">
		<div>
			<Button on:click={() => timer.start()}>Start</Button>
			<Button on:click={() => timer.stop()}>Stop</Button>
		</div>
		<div>
			<ul>
				<li>Start: {$timerStore.start}</li>
				<li>Now: {$timerStore.now}</li>
				<li>End: {$timerStore.end}</li>
				<li>Duration: {$timerStore.duration}</li>
				<li>Game Over: {$timerStore.gameOver}</li>
			</ul>
		</div>
	</Dialog.Content>
</Dialog.Root>
