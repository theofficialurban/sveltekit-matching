<script lang="ts">
	import GameTimer from '$lib/stores/timer';
	import Game from '$components/Game/game.svelte';
	import CardStore from '$lib/stores/cards';
	import Face from '$lib/assets/card-face.png';
	import Face2 from '$lib/assets/card2.png';
	let timer: GameTimer = GameTimer.newTimer(10, 'seconds');
	let cards: CardStore = new CardStore(5, true, [Face, Face2]);
</script>

<Game {timer} hand={cards} controls />
