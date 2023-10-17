<script lang="ts">
	import { SvelteComponent, createEventDispatcher } from 'svelte';
	import { throttle } from 'lodash-es';
	import * as Card from '$components/ui/card';
	import type Game from '$lib/classes/Game';
	import type { Timer } from '$lib/types/Timer';
	export class TimerComponent extends SvelteComponent<Timer['Props'], Timer['Events']> {}
	let className = 'mx-auto w-auto';

	export { className as class };
	export let game: Game;

	const dispatch = createEventDispatcher<Timer['Events']>();
	const { timer, hand } = game;
	timer.bindDispatcher(dispatch);
	const { store } = timer;

	const handleStart = (e: MouseEvent) => {
		if ($store.gameOver !== 'notstarted') alert('ERROR');
		hand.shuffle(5).then(() => {
			timer.start();
		});
	};
	const handleReset = throttle(async () => {
		if ($store.gameOver !== 'true') return;
		await timer.stop();
		hand.newHand();
	}, 5000);
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
			<slot name="gameOver">
				<span class="text-red-600 font-extrabold text-lg">GAME OVER</span>
				<button on:click={handleReset}>RESET</button>
			</slot>
		{:else if $store.gameOver === 'notstarted'}
			<slot name="start"
				><span class="text-red-600 font-extrabold text-3xl">
					<button on:click={throttle(handleStart)}>Start</button>
				</span></slot
			>
		{/if}
	</Card.Content>
</Card.Root>
