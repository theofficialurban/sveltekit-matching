<script lang="ts">
	import Game from '$lib/components/Game/game.svelte';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
	const { game } = data;
</script>

<Game {game} />
