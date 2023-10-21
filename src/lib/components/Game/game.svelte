<script lang="ts">
	import type GameManager from '$lib/stores/manager';
	import Dashboard from '../Dashboard/dashboard.svelte';
	import CardHand from '../Hand/card-hand.svelte';
	import Timer from '../Timer/timer.svelte';
	export let game: GameManager;
	const {
		settings: { controls }
	} = game;
</script>

<div class="text-3xl text-center">
	<Timer {game} />
</div>
{#if controls}
	<Dashboard {game} />
{/if}
{#if !game}
	Error Initializing Game
{:else}
	<CardHand {game} />
{/if}
