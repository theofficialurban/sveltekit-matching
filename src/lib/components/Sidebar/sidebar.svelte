<script lang="ts">
	import type CardGame from '$lib/classes/CardGame';
	import CardControls from '../Dashboard/card-controls.svelte';
	import { Play, Ban, Home, Trophy } from 'lucide-svelte';
	import Icon from '../SVG/icon.svelte';
	import Button from '../ui/button/button.svelte';
	import type { User } from '@supabase/supabase-js';
	import { fade } from 'svelte/transition';
	export let game: CardGame | null = null;
	export let user: User | null = null;
</script>

<div
	transition:fade|global={{ duration: 1000 }}
	class="fixed left-0 w-[85px] bg-[#191c1f] h-[100%]"
>
	<center>
		<a href="/difficulty/1" class="p-3 w-[75px] h-[75px] justify-start">
			<Icon />
		</a>
		{#if game}
			<div class="grid grid-flow-row gap-6 px-5 justify-start">
				<Button size="icon" variant="outline" on:click={game.timer.start}><Play /></Button>
				<Button size="icon" variant="outline" on:click={game.reset}><Ban /></Button>
				<hr />
				{#if game.isAdmin()}
					<div class=""><CardControls {game} /></div>
					<hr />
				{/if}
				<Button size="icon" variant="outline" href="/difficulty/0" on:click={game.reset}>0</Button>
				<Button size="icon" variant="outline" href="/difficulty/1" on:click={game.reset}>1</Button>
				<Button size="icon" variant="outline" href="/difficulty/2" on:click={game.reset}>2</Button>
			</div>
		{/if}
		<div class="grid grid-flow-row gap-6 px-5 justify-start">
			<hr />
			<Button size="icon" variant="outline" href="/difficulty/1"><Home /></Button>
			<Button size="icon" variant="outline" href="/game-results"><Trophy /></Button>
		</div>
	</center>
</div>
