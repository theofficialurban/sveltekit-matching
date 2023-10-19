<script lang="ts">
	import GameComponent from '$components/Game/game.svelte';
	import Game from '$lib/classes/Game';
	import CardStore from '$lib/stores/cards';
	import Face from '$lib/assets/card-face.png';
	import Face2 from '$lib/assets/card2.png';
	import { linear } from 'svelte/easing';

	let cards: CardStore = new CardStore(5, true, [Face, Face2]);
	const game: Game = new Game(cards, { duration: 10000, easing: linear });
	game.controls = true;
</script>

<GameComponent {game} />
