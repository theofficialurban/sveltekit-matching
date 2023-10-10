<script lang="ts">
	import Game from '$lib/classes/Game';
	const { initGame, cards, flippedCards } = new Game();
</script>

<!-- <img
					class="rounded-xl"
					src="https://academics.otc.edu/media/uploads/sites/35/2015/10/not-pictured-250x350.png"
					alt="card"
				/> -->
<button class="bg-orange-500" on:click={() => console.log(cards)}>Click</button>
<button on:click={() => cards[0].$set({ state: { _status: 'FACEUP' } })}>Flipped</button>
<div use:initGame={{ count: 5 }} class="grid grid-flow-row grid-cols-5 gap-4" />
