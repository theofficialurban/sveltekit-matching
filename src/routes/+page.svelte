<script lang="ts">
	import Icon from '$lib/components/SVG/icon.svelte';
	import SvelteIcon from '$lib/assets/Svelte_Logo.png';
</script>

<center class="grid grid-flow-row">
	<a href="./difficulty/one" class="py-10"><Icon width="500px" height="500px" /></a>
	<div class="flex mx-auto gap-4 justify-center">
		<img width="50" height="50" alt="svelte_logo" src={SvelteIcon} />
		<a href="https://svelte.dev" class="sveltekit">SvelteKit</a>
		<div class="text-5xl font-extrabold">Matching Game 🃏</div>
	</div>
</center>

<style>
	.sveltekit {
		@apply bg-gradient-to-r text-transparent bg-clip-text from-[#e60b09] to-[#e9d022];
		@apply text-5xl font-extrabold;
	}
</style>
