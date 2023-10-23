<script lang="ts">
	import Button from '../ui/button/button.svelte';
	import * as Accordion from '../ui/accordion/index';
	import * as Dialog from '$components/ui/dialog';
	import type GameManager from '$lib/stores/manager';
	import { onMount } from 'svelte';
	import { GameStatus } from '$lib/stores/game';
	export let game: GameManager;
	const {
		hand,
		timer,
		vitals: { admin }
	} = game;

	const { store: cardStore, pairs } = hand;
</script>

<Dialog.Root>
	<Dialog.Trigger>
		<Button variant="secondary">🃏 Admin Controls</Button>
	</Dialog.Trigger>
	<Dialog.Content class="grid grid-rows-2 gap-4 w-max">
		<div>
			<div>Card Controls:</div>
			<Button on:click={() => hand.shuffle(3)} variant="secondary">Shuffle</Button>
			<Button on:click={() => hand.setStatus('FACEDOWN')} variant="secondary">Cover All</Button>
			<Button on:click={() => hand.setStatus('FACEUP')} variant="secondary">Reveal All</Button>
			<Button on:click={() => hand.newHand()} variant="secondary">New Hand</Button>
		</div>
		<div>
			<div>Game Status:</div>
			<Button on:click={() => (game.vitals.status = GameStatus.ENDED)} variant="secondary"
				>Status Over</Button
			>
			<Button on:click={() => (game.vitals.status = GameStatus.INPROGRESS)} variant="secondary"
				>Status In Progress</Button
			>
		</div>
		<div>
			<div>Time Controls</div>
			<Button on:click={() => timer.start()} variant="secondary">Start</Button>
			<Button on:click={() => timer.stop()} variant="secondary">Stop</Button>
			<Button on:click={() => timer.reset()} variant="secondary">Reset</Button>
		</div>
		<Accordion.Root class="overflow-scroll">
			<Accordion.Item value="0">
				<Accordion.Trigger>Card Counts</Accordion.Trigger>
				<Accordion.Content>
					<Button on:click={() => alert(hand.count.FACEUP)}>Count Face Up</Button>
					<Button on:click={() => alert(hand.count.FACEDOWN)}>Count Face Down</Button>
					<Button on:click={() => alert(hand.count.TOTAL)}>Count Total</Button>
					<Button on:click={() => alert(game.vitals.current.count)}>Count Current Played</Button>
					<div class="container">
						ID: {game.vitals.current.one?._id ?? null} | Value: {game.vitals.current.one?._value ??
							null}<br />
						ID: {game.vitals.current.two?._id ?? null} | Value: {game.vitals.current.two?._value ??
							null}<br />
						COUNT: {game.vitals.current.count}
					</div>
				</Accordion.Content>
			</Accordion.Item>
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
				<Accordion.Trigger>Rules</Accordion.Trigger>
				<Accordion.Content>
					Rules
					<ol>
						{#each admin.rules as rule}
							<li>
								Rule ID: {rule[1].info.id} | {rule[1].ruleName}
								<button on:click={() => rule[1].attempt(game.vitals)}>Click to Test</button>
							</li>
						{/each}
					</ol>
				</Accordion.Content>
			</Accordion.Item>
		</Accordion.Root>
	</Dialog.Content>
</Dialog.Root>
