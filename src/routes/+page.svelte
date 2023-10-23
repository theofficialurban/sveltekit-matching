<script lang="ts">
	import Face from '$lib/assets/card-face.png';
	import Face2 from '$lib/assets/card2.png';

	import Game from '$lib/components/Game/game.svelte';

	import GameManager from '$lib/stores/manager';
	const game = GameManager.init({
		playSize: 2,
		controls: true,
		timer: {
			duration: 45
		},
		cards: {
			count: 5,
			pairs: true,
			faceImgs: [Face, Face2]
		}
	});
	game.vitals.addGameRule('Values Rule', (game) => {
		const one = game.current.one;
		const two = game.current.two;
		if (one && two) {
			if (one._value === two._value) return Promise.resolve(true);
		}
		return Promise.reject();
	});
	const { hand } = game;
</script>

<Game {game} />
