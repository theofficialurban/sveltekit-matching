<script lang="ts">
	import { Status } from '$lib/classes/CardGame';
	import Game from '$lib/components/Game/game.svelte';
	import LevelScreen from '$lib/components/Game/level/level-screen.svelte';
	import Sidebar from '$lib/components/Sidebar/sidebar.svelte';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
	const { game } = data;
	const {
		game: g,
		level: { color }
	} = game;
</script>

<Game {game} />
