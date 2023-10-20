<script lang="ts">
	import Face from '$lib/assets/card-face.png';
	import Face2 from '$lib/assets/card2.png';
	import Dashboard from '$lib/components/Dashboard/dashboard.svelte';
	import CardHand from '$lib/components/Hand/card-hand.svelte';
	import PlayingCard from '$lib/components/PlayingCard/playing-card.svelte';
	import Timer from '$lib/components/Timer/timer.svelte';
	import GameManager from '$lib/stores/manager';
	const game = GameManager.init({
		playSize: 2,
		controls: true,
		timer: {
			duration: 10
		},
		cards: {
			count: 3,
			pairs: false
		}
	});
	const { hand } = game;
</script>

<Dashboard {game} />

<Timer {game} />
f

<CardHand {game} />
