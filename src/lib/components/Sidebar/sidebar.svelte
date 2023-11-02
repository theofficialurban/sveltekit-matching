<script lang="ts">
	import type CardGame from '$lib/classes/CardGame';
	import CardControls from '../Dashboard/card-controls.svelte';
	import { Play, Ban } from 'lucide-svelte';
	import Icon from '../SVG/icon.svelte';
	import Button from '../ui/button/button.svelte';
	import type { User } from '@supabase/supabase-js';
	export let game: CardGame;
	export let user: User;
	const {
		timer: { start, stop },
		reset,
		isAdmin
	} = game;
</script>

<div class="fixed left-0 w-[85px] bg-[#191c1f] h-[100%]">
	<center>
		<span class="p-3 w-[75px] h-[75px] justify-start">
			<Icon />
		</span>
		<div class="grid grid-flow-row gap-6 px-5 justify-start">
			<Button size="icon" variant="outline" on:click={start}><Play /></Button>
			<Button size="icon" variant="outline" on:click={reset}><Ban /></Button>
			<hr />
			{#if isAdmin()}
				<div class=""><CardControls {game} /></div>
				<hr />
			{/if}
		</div>
	</center>
</div>
