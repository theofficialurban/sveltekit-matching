<script lang="ts">
	import '../app.postcss';
	import Button from '$lib/components/ui/button/button.svelte';
	import Icon from '$lib/components/SVG/icon.svelte';
	import type { LayoutData } from './$types';
	import CardControls from '$lib/components/Dashboard/card-controls.svelte';
	import GameHeader from '$lib/components/Game/header/game-header.svelte';
	import Sidebar from '$lib/components/Sidebar/sidebar.svelte';
	export let data: LayoutData;
	const { game } = data;
</script>

<div class="absolute w-screen h-screen">
	<Sidebar {game} />

	<div class=" container w-[100%] h-fit mx-auto mt-28">
		<div class="mt-4"><slot /></div>
	</div>
</div>
