<script lang="ts">
	import '../../../app.postcss';

	import type { LayoutData } from './$types';

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
