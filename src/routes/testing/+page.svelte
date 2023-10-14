<script lang="ts">
	import GameTimer from '$lib/components/GameTimer/game-timer.svelte';
</script>

<GameTimer duration={5} units={'seconds'} controls on:end={() => console.log('Ended Yay')} />
