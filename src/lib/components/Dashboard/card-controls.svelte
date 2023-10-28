<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Accordion from '$lib/components/ui/accordion/';
	import type BicycleCard from '$lib/types/BicycleCard';
	import Button from '../ui/button/button.svelte';
	import type ICardGame from '$lib/types/CardGame';
	import type GameTimer from '$lib/classes/GameTimer';
	//export let deck: BicycleCard['Deck'];
	export let game: ICardGame['GAME'];
	export let timer: GameTimer;
	const {
		deck: { setStatus, shuffle, getDeck },
		handler: { play$, actions },
		inPlay: { count: inPlayCount, store: inPlayStore },

		eventLogger: { store: eventStore },
		reset
	} = game;
	const { start, stop, reset: gtReset } = timer;

	let tseconds: string;
	let cardIdControl: string = 'null';
	let statusSelection: BicycleCard['Status'];
	const store = getDeck();
	const execute = () => {
		if (cardIdControl !== 'null') {
			const f = cardIdControl.split(',');
			let x: number[] = f.map((x) => parseInt(x));
			setStatus(statusSelection, ...x);
		} else {
			setStatus(statusSelection);
		}
	};
</script>

<Dialog.Root>
	<Dialog.Trigger>
		<Button>Event Log</Button>
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
</Dialog.Root>
<Dialog.Root>
	<Dialog.Trigger>
		<Button>Card Controls</Button>
	</Dialog.Trigger>
	<Dialog.Content>
		<Button on:click={() => setStatus('FACEUP')}>Reveal All</Button>
		<Button on:click={() => setStatus('FACEDOWN')}>Cover All</Button>
		<Button on:click={() => shuffle(5)}>Shuffle</Button>
		<Button on:click={() => reset()}>Reset All</Button>

		<Accordion.Root>
			<Accordion.Item value="1">
				<Accordion.Trigger>Custom Controls</Accordion.Trigger>
				<Accordion.Content class="text-black">
					<div class="grid grid-flow-col gap-5">
						<input placeholder="Card ID to Change" bind:value={cardIdControl} />
						<select bind:value={statusSelection}>
							<option value="FACEUP">FACEUP</option>
							<option value="FACEDOWN">FACEDOWN</option>
						</select>
						<Button on:click={execute}>Execute</Button>
					</div>
				</Accordion.Content>
			</Accordion.Item>
			<Accordion.Item value="2">
				<Accordion.Trigger>Game Subject</Accordion.Trigger>
				<Accordion.Content>
					<Button on:click={() => play$({ status: actions.start })}>start</Button>
					<Button on:click={() => play$({ status: actions.end })}>end</Button>
					<Button on:click={() => play$({ status: actions.match })}>match</Button>
					<Button on:click={() => play$({ status: actions.no_match })}>no_match</Button>
					<Button on:click={() => play$({ status: actions.check_cards })}>check_cards</Button>
				</Accordion.Content>
			</Accordion.Item>
			<Accordion.Item value="3">
				<Accordion.Trigger>Card List</Accordion.Trigger>
				<Accordion.Content>
					{#each $store as card (card.id)}
						<span>ID: {card.id} || VALUE: {card.value} || STATUS: {card.status}</span><br />
					{/each}
				</Accordion.Content>
			</Accordion.Item>
			<Accordion.Item value="4">
				<Accordion.Trigger>In-Play - {inPlayCount()}</Accordion.Trigger>
				<Accordion.Content>
					{$inPlayStore.one ? $inPlayStore.one.id : 'Null'}<br />
					{$inPlayStore.two ? $inPlayStore.two.id : 'Null'}<br />
				</Accordion.Content>
			</Accordion.Item>
			<Accordion.Item value="5">
				<Accordion.Trigger>Timer</Accordion.Trigger>
				<Accordion.Content class="grid grid-flow-row">
					<div>
						<Button on:click={() => start()}>Start Timer</Button>
						<Button on:click={() => stop()}>Stop Timer</Button>
						<Button on:click={() => gtReset()}>Reset Timer</Button>
					</div>
					<div>
						<input class="text-black" bind:value={tseconds} />
						<button on:click={() => (timer.timer = parseInt(tseconds))}>Set Timer</button>
					</div>
				</Accordion.Content>
			</Accordion.Item>
		</Accordion.Root>
	</Dialog.Content>
</Dialog.Root>
