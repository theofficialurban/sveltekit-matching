<script lang="ts">
	import Game from '$lib/classes/Game';
	import PlayingCardThree from '$lib/components/PlayingCardThree/playing-card-three.svelte';
	import ccreateCards, { type Deck } from '$lib/stores/cards';

	const game = new Game(2);
</script>

<button on:click={() => console.log(game.flipped)}>Click</button>
<div class="grid grid-flow-row grid-cols-5 gap-4">
	{#each game.deck as card, i}
		<svelte:component
			this={PlayingCardThree}
			bind:this={game.components[i]}
			on:click={game.components[i].flip}
			on:reveal={game.handleFlip}
			on:cover={game.handleCover}
			bind:state={card}
		>
			<svelte:fragment
				><img
					class="rounded-xl"
					src="https://academics.otc.edu/media/uploads/sites/35/2015/10/not-pictured-250x350.png"
					alt="card"
				/></svelte:fragment
			>
		</svelte:component>
	{/each}
</div>
