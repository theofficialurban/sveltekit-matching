<script lang="ts">
	import * as Bicycle from '$lib/components/BicycleCard';
	import { crossfade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { flip } from 'svelte/animate';
	import type CardGame from '$lib/classes/CardGame';
	import { createEventDispatcher } from 'svelte';
	import type { IN_PLAY_OBJECT } from '$lib/classes/InPlay';
	const dispatch = createEventDispatcher<{ match: IN_PLAY_OBJECT; nomatch: IN_PLAY_OBJECT }>();
	export let game: CardGame;
	$: g = game.game;
	$: timer = game.timer.gameTimer;
	const [send, recieve] = crossfade({ duration: 1500, easing: quintOut });
	$: deck = game.deck.getDeck();
	$: totalCards = $deck.length;

	function checkCards() {
		const { one, two } = game.inPlay.current;
		if (one && two) {
			const fn = () => {
				game.deck.setStatus('FACEDOWN', one.id, two.id);
				if (one.value === two.value) {
					return dispatch('match', { one, two });
				} else {
					return dispatch('nomatch', { one, two });
				}
			};
			setTimeout(fn, 2000);
		}
	}
</script>

<div class="w-full container grid grid-cols-5">
	{#each $deck as card (card.id)}
		<div
			in:recieve={{ key: card.id }}
			out:send={{ key: card.id }}
			animate:flip={{ duration: 500, easing: quintOut }}
		>
			<Bicycle.Card
				on:click={() => {
					if (game.inPlay.count() < 2 || card.status === 'FACEUP') return card.flip();
					console.log('onclick');
				}}
				on:faceup={(e) => {
					if (game.inPlay.count() >= 2) return e.preventDefault();
					console.log('faceup');
					card
						.playCard()
						.then((slot) => {
							if (game.inPlay.count() === 2) checkCards();
							console.log('Card played in slot', slot);
						})
						.catch(() => console.error('Could not play card'));
				}}
				on:facedown={(e) => {
					if (!card.unPlayCard()) return e.preventDefault();
					console.log('facedwn');
				}}
				{game}
				store={card.store}
			/>
		</div>
	{/each}
</div>
