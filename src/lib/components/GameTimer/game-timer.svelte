<script lang="ts">
	import GameTimer, { type Timer } from '$lib/stores/timer';
	import { createEventDispatcher } from 'svelte';
	import * as Card from '$components/ui/card';
	import Button from '$components/ui/button/button.svelte';
	import type { DurationInputArg1, DurationInputArg2 } from 'moment';
	export let duration: DurationInputArg1 = 10;
	export let units: DurationInputArg2 = 'seconds';
	export let controls: boolean = false;
	const dispatch = createEventDispatcher<{ start: Timer; end: Timer; stop: null }>();
	const time = GameTimer.newTimer(duration, units, {
		start: (timer) => dispatch('start', timer),
		end: (timer) => dispatch('end', timer),
		stop: () => dispatch('stop')
	});
	const { store } = time;
</script>

{#if controls}
	<Card.Root>
		<Card.Header>
			<span
				class="text-3xl font-extrabold bg-gradient-to-r from-[#FC466B] to-[#3F5EFB] bg-clip-text text-transparent"
				>Timer Control Panel</span
			>
		</Card.Header>
		<Card.Content class="grid grid-flow-col justify-evenly">
			<div>
				<Button on:click={() => time.start()}>Start</Button>
				<Button on:click={() => time.stop()}>Stop</Button>
			</div>
			<div>
				<ul>
					<li>Start: {$store.start}</li>
					<li>Now: {$store.now}</li>
					<li>End: {$store.end}</li>
					<li>Duration: {$store.duration}</li>
					<li>Game Over: {$store.gameOver}</li>
				</ul>
			</div>
		</Card.Content>
	</Card.Root>
{/if}
<br />
<Card.Root class="mx-auto w-auto">
	<Card.Header
		class="bg-gradient-to-r from-[#FC466B] to-[#3F5EFB] bg-clip-text text-transparent font-extrabold text-4xl"
		>Game Timer</Card.Header
	>
	<Card.Content class="text-center">
		{#if $store.gameOver === 'false' && $store.secondsLeft}
			<span class="text-green-600 font-extrabold text-8xl">
				{$store.secondsLeft}
			</span>
		{:else if $store.gameOver === 'true'}
			<span class="text-red-600 font-extrabold text-8xl"> 😟 GAME OVER 😟 </span>
		{:else if $store.gameOver === 'notstarted'}
			<span class="text-red-600 font-extrabold text-8xl"> HIT PLAY </span>
		{/if}
	</Card.Content>
</Card.Root>
