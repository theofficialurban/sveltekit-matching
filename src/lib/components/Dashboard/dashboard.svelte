<script lang="ts">
	import type CardStore from '$lib/stores/cards';
	import Button from '../ui/button/button.svelte';
	import * as Accordion from '../ui/accordion/index';
	import * as Card from '../ui/card';
	import * as Collapsible from '$components/ui/collapsible';
	import type GameTimer from '$lib/stores/timer';
	export let hand: CardStore;
	export let timer: GameTimer;
	const { store: cardStore, pairs } = hand;
	const { store: timerStore } = timer;
</script>

<Collapsible.Root class="p-4">
	<Collapsible.Trigger>
		<Button>Control Panel</Button>
	</Collapsible.Trigger>
	<Collapsible.Content class="grid grid-cols-2 gap-4">
		<Card.Root class="bg-black">
			<Card.Header>
				<span
					class="text-3xl font-extrabold bg-gradient-to-r from-[#FC466B] to-[#3F5EFB] bg-clip-text text-transparent"
					>Timer Control Panel</span
				>
			</Card.Header>
			<Card.Content class="grid grid-flow-col justify-evenly">
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
			</Card.Content>
		</Card.Root>
		<Card.Root class="bg-black">
			<Card.Header class="text-3xl">Dashboard</Card.Header>
			<Card.Content>
				<div class="container">
					<Button on:click={() => hand.shuffle(3)} variant="secondary">Shuffle</Button>
					<Button on:click={() => hand.coverAll()} variant="secondary">Cover All</Button>
					<Button on:click={() => hand.revealAll()} variant="secondary">Reveal All</Button>
					<Button on:click={() => hand.newHand()} variant="secondary">New Hand</Button>
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
				</Accordion.Root>
			</Card.Content>
		</Card.Root>
	</Collapsible.Content>
</Collapsible.Root>
