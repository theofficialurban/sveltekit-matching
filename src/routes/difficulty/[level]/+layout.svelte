<script lang="ts">
	import { page } from '$app/stores';
	import Sidebar from '$lib/components/Sidebar/sidebar.svelte';
	import { onMount } from 'svelte';
	import '../../../app.postcss';
	import { scale } from 'svelte/transition';
	let show = false;
	onMount(() => (show = true));
</script>

<div class="absolute w-screen h-screen">
	<Sidebar user={$page.data.user} game={$page.data.game} />
	{#if show}
		<div
			in:scale={{ duration: 500, delay: 550 }}
			out:scale={{ duration: 500 }}
			class=" container w-[100%] h-fit mx-auto mt-28"
		>
			<slot />
		</div>
	{/if}
</div>
