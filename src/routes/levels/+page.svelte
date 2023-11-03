<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import '../../app.postcss';
	import LevelItem from '$lib/components/LevelSelection/level-item.svelte';
	import { fly } from 'svelte/transition';
	export let data: PageData;
	let show = false;
	onMount(() => (show = true));
</script>

{#if show}
	<center transition:fly={{ duration: 500 }}>
		{#each data.levels as level}
			<LevelItem --from={level.color.from} --to={level.color.to} {level} />
		{/each}
	</center>
{/if}
