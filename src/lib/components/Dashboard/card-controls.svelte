<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Accordion from '$lib/components/ui/accordion/';
	import type BicycleCard from '$lib/types/BicycleCard';
	import { Shield, ListTree } from 'lucide-svelte';
	import Button from '../ui/button/button.svelte';
	import type CardGame from '$lib/classes/CardGame';

	export let game: CardGame;
	$: deck = game.deck.getDeck();
</script>

<!-- <Dialog.Root>
	<Dialog.Trigger class="py-3">
		<center><Button variant="outline" size="icon" value="Logs"><ListTree /></Button></center>
	</Dialog.Trigger>
	<Dialog.Content class="overflow-scroll h-[300px] w-[500px]">
		{#each $eventStore as event}
			<table class="p-4">
				<thead>
					<tr>
						<th>⏳ Timestamp</th>
						<th>Event</th>
						<th>Score</th>
						<th>Cards Left</th>
						<th>Seconds Left</th>
					</tr>
				</thead>
				<tbody>
					<tr class="text-center">
						<td class="text-teal-400 font-bold">{event.time}</td>
						<td class="text-red-700 font-bold">{event.type}</td>
						<td class="text-amber-500 font-bold">{event.data._score}</td>
						<td class="text-purple-600 font-bold">{event.data._cardsRemaining}</td>
						<td class="text-blue-600 font-bold">{event.data._currentTime}</td>
					</tr>
				</tbody>
			</table>
		{/each}
	</Dialog.Content>
</Dialog.Root> -->
<Dialog.Root>
	<Dialog.Trigger>
		<Button variant="outline" size="icon"><Shield /></Button>
	</Dialog.Trigger>
	<Dialog.Content>
		<Button on:click={() => game.deck.shuffle(5)}>Shuffle</Button>
		<Button on:click={() => game.reset()}>Reset</Button>

		<Accordion.Root>
			<Accordion.Item value="2">
				<Accordion.Trigger>Game Subject</Accordion.Trigger>
				<Accordion.Content>
					<Button on:click={() => game.handler.play$('start')}>start</Button>
					<Button on:click={() => game.handler.play$('end')}>end</Button>
					<Button on:click={() => game.handler.play$('match')}>match</Button>
					<Button on:click={() => game.handler.play$('no_match')}>no_match</Button>
				</Accordion.Content>
			</Accordion.Item>
			<Accordion.Item value="3">
				<Accordion.Trigger>Card List</Accordion.Trigger>
				<Accordion.Content>
					{#each $deck as card (card.id)}
						<span>ID: {card.id} || VALUE: {card.value} || STATUS: {card.status}</span><br />
					{/each}
				</Accordion.Content>
			</Accordion.Item>
			<Accordion.Item value="4">
				<Accordion.Trigger>In-Play - {game.inPlay.count}</Accordion.Trigger>
				<Accordion.Content>
					{game.inPlay.current.one ? game.inPlay.current.one : 'Null'}<br />
					{game.inPlay.current.two ? game.inPlay.current.two : 'Null'}<br />
				</Accordion.Content>
			</Accordion.Item>
			<Accordion.Item value="5">
				<Accordion.Trigger>Timer</Accordion.Trigger>
				<Accordion.Content class="grid grid-flow-row">
					<div>
						<Button on:click={() => game.timer.start()}>Start Timer</Button>
						<Button on:click={() => game.timer.stop()}>Stop Timer</Button>
						<Button on:click={() => game.reset()}>Reset Timer</Button>
					</div>
				</Accordion.Content>
			</Accordion.Item>
		</Accordion.Root>
	</Dialog.Content>
</Dialog.Root>
