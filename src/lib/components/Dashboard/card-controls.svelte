<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Accordion from '$lib/components/ui/accordion/';
	import type BicycleCard from '$lib/types/BicycleCard';
	import Button from '../ui/button/button.svelte';
	import type ICardGame from '$lib/types/CardGame';
	//export let deck: BicycleCard['Deck'];
	export let game: ICardGame['GAME'];

	const {
		deck: { setStatus, shuffle, getDeck },
		utils: { gameAction },
		play$
	} = game;
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
		<Button>Card Controls</Button>
	</Dialog.Trigger>
	<Dialog.Content>
		<Button on:click={() => setStatus('FACEUP')}>Reveal All</Button>
		<Button on:click={() => setStatus('FACEDOWN')}>Cover All</Button>
		<Button on:click={() => shuffle(5)}>Shuffle</Button>

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
					<Button on:click={() => play$({ status: gameAction('start') })}>start</Button>
					<Button on:click={() => play$({ status: gameAction('end') })}>end</Button>
					<Button on:click={() => play$({ status: gameAction('match') })}>match</Button>
					<Button on:click={() => play$({ status: gameAction('no_match') })}>no_match</Button>
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
		</Accordion.Root>
	</Dialog.Content>
</Dialog.Root>
