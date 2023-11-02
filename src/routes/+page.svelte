<script lang="ts">
	import Icon from '$lib/components/SVG/icon.svelte';
	import SvelteIcon from '$lib/assets/Svelte_Logo.png';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	let show = false;
	onMount(() => (show = true));
</script>

{#if show}
	<center
		transition:fly|global={{ duration: 1000 }}
		class="grid grid-flow-col justify-evenly align-middle py-28"
	>
		<a href="./difficulty/1" class=""><Icon width="500px" height="500px" /></a>
		<div class="grid grid-flow-row content-center">
			<a href="https://svelte.dev" class="sveltekit">
				<img src={SvelteIcon} alt="svelte" width="75px" height="75px" />
				SvelteKit
			</a>
			<div class="text-5xl font-extrabold">Matching Game</div>
		</div>
	</center>
{/if}

<style>
	.sveltekit {
		@apply bg-gradient-to-r text-transparent bg-clip-text from-[#e60b09] to-[#e9d022];
		@apply text-8xl font-light grid grid-flow-col;
	}
</style>
