<script lang="ts">
	import { onMount } from 'svelte';

	import * as Card from '$lib/components/ui/card';
	import IconTwo from '$lib/components/SVG/icon-two.svelte';
	import Hourglass from '$lib/components/SVG/hourglass.svelte';

	import GameIcon from '$lib/components/SVG/game-icon.svelte';
	import { animate } from 'motion';
	import type Level from '$lib/classes/Level';
	let show = false;
	export let side: 'right' | 'left' = 'left';
	export let level: Level;
	onMount(() => (show = true));
	function float(node: HTMLAnchorElement) {
		const floatUp = () => {
			animate(node, { transform: 'translateY(-5px)' });
		};
		const floatDown = () => {
			animate(node, { transform: 'translateY(0px)' });
		};
		node.addEventListener('pointerenter', floatUp);
		node.addEventListener('pointerleave', floatDown);
		return {
			destroy() {
				node.removeEventListener('pointerenter', floatUp);
				node.removeEventListener('pointerleave', floatDown);
			}
		};
	}
</script>

<a href={`/difficulty/${level.level}`} class="p-10" use:float>
	<Card.Root class={`w-[1000px] rounded-xl bg-gradient-to-br from-black`}>
		<Card.Header class="grid grid-flow-col ">
			{#if side === 'left'}
				<div class="grid grid-flow-row">
					<span class="font-thin text-2xl">Level</span>
					<div class="lvlGradient text-8xl font-semibold place-content-start">{level.level}</div>
				</div>
			{/if}
			<div class="flex align-middle items-center">
				<IconTwo width="100px" height="100px" />
				<div class="grid grid-flow-row text-center">
					<span class="text-6xl text-red-600">{level.cardOptions.count}</span>
					<span class="text-xl">Cards</span>
				</div>
			</div>
			<div class="flex items-center">
				<Hourglass width="100px" height="100px" />
				<div class="grid grid-flow-row text-center">
					<span class="text-6xl text-red-600">{level.timerOptions.time}</span>
					<span class="text-xl">Seconds</span>
				</div>
			</div>

			<div class="grid grid-flow-row items-center justify-end">
				<GameIcon width="100px" height="100px" />
			</div>
			{#if side === 'right'}
				<div class="grid grid-flow-row">
					<span class="font-thin text-2xl">Level</span>
					<span class="text-8xl font-semibold place-content-start">#1</span>
				</div>
			{/if}
		</Card.Header>
	</Card.Root>
</a>

<style>
	.lvlGradient {
		@apply bg-gradient-to-r text-transparent bg-clip-text from-[var(--from)] to-[var(--to)];
	}
	div {
		font-family: PlayingCards;
	}
	@font-face {
		font-family: PlayingCards;
		src: url($lib/assets/playingcards.TTF);
	}
</style>
