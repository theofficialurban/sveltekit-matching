<script lang="ts">
	import Sidebar from '$lib/components/Sidebar/sidebar.svelte';
	import { onMount } from 'svelte';
	import type { LayoutData } from './$types';
	import { blur } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	export let data: LayoutData;
	let show = false;
	onMount(() => (show = true));
</script>

<div>
	<Sidebar />
	{#if show}
		<div
			class="container p-10"
			in:blur={{ duration: 500, delay: 550, easing: quintOut }}
			out:blur={{ duration: 500, easing: quintOut }}
		>
			<slot />
		</div>
	{/if}
</div>
