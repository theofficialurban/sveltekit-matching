<script lang="ts">
	import Face from '$lib/assets/card-face.png';
	import Face2 from '$lib/assets/card2.png';
	import Dashboard from '$lib/components/Dashboard/dashboard.svelte';
	import Game from '$lib/components/Game/game.svelte';
	import CardHand from '$lib/components/Hand/card-hand.svelte';
	import PlayingCard from '$lib/components/PlayingCard/playing-card.svelte';
	import Timer from '$lib/components/Timer/timer.svelte';
	import GameManager from '$lib/stores/manager';
	const game = GameManager.init({
		playSize: 2,
		controls: true,
		timer: {
			duration: 30
		},
		cards: {
			count: 5,
			pairs: true,
			faceImgs: [Face, Face2]
		}
	});
	const { hand } = game;
</script>

<Game {game} />
