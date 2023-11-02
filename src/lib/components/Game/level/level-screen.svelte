<script lang="ts">
	import type CardGame from '$lib/classes/CardGame';
	import Hourglass from '$lib/components/SVG/hourglass.svelte';
	import IconTwo from '$lib/components/SVG/icon-two.svelte';

	import Icon from '$lib/components/SVG/icon.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	export let game: CardGame;
	const {
		level: {
			level,
			cardOptions: { count },
			timerOptions: { time }
		},
		timer: { start }
	} = game;
</script>

<div>
	<center class="grid grid-flow-col justify-evenly">
		<div>
			<svelte:component this={Icon} width="500px" height="500px" />
		</div>

		<div class="py-28 font-extrabold grid grid-flow-row">
			<span class="text-xl">Welcome To....</span>
			<span class="text-8xl level">LEVEL {level}</span>
			<div class="grid grid-flow-col text-xl font-light">
				<div class="grid grid-flow-col py-6">
					<div class="grid grid-flow-row">
						<center class="">
							<IconTwo width="75px" height="75px" />
						</center>
						<div class="font-light text-2xl">
							<span class="text-red-800">{2 * (count ?? 0)}</span> Cards
						</div>
					</div>
					<div class="grid grid-flow-row">
						<center class="">
							<Hourglass width="75px" height="75px" />
						</center>
						<div class="text-2xl font-light">
							<span class=" text-lime-400">{time}</span> seconds
						</div>
					</div>
				</div>
			</div>
			<div class="py-5">
				<Button on:click={start} size="lg" variant="outline" class="">
					<span class="playBtn">PLAY GAME</span>
				</Button>
			</div>
		</div>
	</center>
</div>

<style>
	.level {
		@apply text-transparent bg-clip-text bg-gradient-to-r from-[var(--from)] to-[var(--to)];
	}
	.playBtn {
		@apply text-transparent bg-clip-text bg-gradient-to-r from-[#57ebde] to-[#aefb2a];
		@apply text-2xl font-bold;
	}
</style>
