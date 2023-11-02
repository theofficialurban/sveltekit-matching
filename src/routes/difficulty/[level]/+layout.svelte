<script lang="ts">
	import { page } from '$app/stores';
	import Sidebar from '$lib/components/Sidebar/sidebar.svelte';
	import '../../../app.postcss';
</script>

<div class="absolute w-screen h-screen">
	<Sidebar user={$page.data.user} game={$page.data.game} />
	<div class=" container w-[100%] h-fit mx-auto mt-28">
		<div class="mt-4"><slot /></div>
	</div>
</div>
