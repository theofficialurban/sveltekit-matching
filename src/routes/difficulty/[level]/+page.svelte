<script lang="ts">
	import { page } from '$app/stores';

	import Game from '$lib/components/Game/game.svelte';
	import IconTwo from '$lib/components/SVG/icon-two.svelte';
	import { onMount } from 'svelte';

	import type { PageData } from './$types';
	import { scale } from 'svelte/transition';

	export let data: PageData;

	$: game = data.game;

	const user = $page.data.user;
</script>

{#if game}
	<Game {game} />
{:else}
	<IconTwo />
{/if}
<div class="fixed right-0 bottom-0 pr-8">
	You are logged in as...
	<span class="userGrad">{user?.user_metadata.custom_claims.global_name ?? ''}</span>
</div>

<style>
	div {
		@apply font-bold text-xl bottom-3 absolute;
	}
	.userGrad {
		@apply bg-gradient-to-r text-transparent bg-clip-text from-[#68e3f9] via-[#f55a9b] to-[#4f4ed7] text-3xl;
	}
</style>
