<script lang="ts">
	import '../../../app.postcss';

	import type { LayoutServerData } from './$types';

	import Sidebar from '$lib/components/Sidebar/sidebar.svelte';
	import CardGame from '$lib/classes/CardGame';
	import type Level from '$lib/classes/Level';
	export let data: LayoutServerData;
	const { level } = data;
	const game = new CardGame(JSON.parse(level));
</script>

<div class="absolute w-screen h-screen">
	<Sidebar {game} />

	<div class=" container w-[100%] h-fit mx-auto mt-28">
		<div class="mt-4"><slot /></div>
	</div>
</div>
