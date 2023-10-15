<script lang="ts">
	import GameTimer, { type Timer } from '$lib/stores/timer';
	import { createEventDispatcher } from 'svelte';
	import * as Card from '$components/ui/card';
	import type { DurationInputArg1, DurationInputArg2 } from 'moment';
	export let duration: DurationInputArg1 = 10;
	export let units: DurationInputArg2 = 'seconds';
	let className = 'mx-auto w-auto';
	export { className as class };
	const dispatch = createEventDispatcher<{ start: Timer; end: Timer; stop: null }>();
	export let timer = GameTimer.newTimer(duration, units, {
		start: (timer) => dispatch('start', timer),
		end: (timer) => dispatch('end', timer),
		stop: () => dispatch('stop')
	});
	const { store } = timer;
</script>

<Card.Root class={className}>
	<Card.Header
		><slot name="header"
			><span
				class="bg-gradient-to-r from-[#FC466B] to-[#3F5EFB] bg-clip-text text-transparent font-extrabold text-2xl"
				>Game Timer</span
			></slot
		></Card.Header
	>
	<Card.Content class="text-center">
		{#if $store.gameOver === 'false' && $store.secondsLeft}
			<slot>
				<span
					class="font-extrabold text-6xl"
					class:text-green-600={$store.secondsLeft >= 10}
					class:text-orange-600={$store.secondsLeft < 10 && $store.secondsLeft > 5}
					class:text-red-600={$store.secondsLeft <= 5}
				>
					{$store.secondsLeft}
				</span>
			</slot>
		{:else if $store.gameOver === 'true'}
			<slot name="gameOver"
				><span class="text-red-600 font-extrabold text-3xl"> 😟 GAME OVER 😟 </span></slot
			>
		{:else if $store.gameOver === 'notstarted'}
			<slot name="start"><span class="text-red-600 font-extrabold text-3xl"> HIT PLAY </span></slot>
		{/if}
	</Card.Content>
</Card.Root>
