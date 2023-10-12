<script lang="ts">
	import type CardStore from '$lib/stores/cards';
	import type { CardState } from '../PlayingCardThree/card';
	import Button from '../ui/button/button.svelte';
	import * as Accordion from '../ui/accordion/index';
	import * as Card from '../ui/card';
	export let deck: CardStore;
	const { store, pairs } = deck;
</script>

<Card.Root class="bg-black">
	<Card.Header class="text-3xl">Dashboard</Card.Header>
	<Card.Content>
		<div class="container">
			<Button on:click={() => deck.shuffle(3)} variant="secondary">Shuffle</Button>
			<Button on:click={() => deck.coverAll()} variant="secondary">Cover All</Button>
			<Button on:click={() => deck.revealAll()} variant="secondary">Reveal All</Button>
			<Button on:click={() => deck.newHand()} variant="secondary">New Hand</Button>
		</div>
		<Accordion.Root>
			<Accordion.Item value="1">
				<Accordion.Trigger>All Cards</Accordion.Trigger>
				<Accordion.Content>
					<ol>
						{#each $store as card, i (card._id)}
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
