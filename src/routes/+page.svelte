<script lang="ts">
	import { createCards } from "$lib/stores/cards";
	import type PlayingCardTwo from "$lib/components/PlayingCardTwo/playing-card-two.svelte";
	import Card from "$lib/components/PlayingCardTwo/playing-card-two.svelte";
	import { flipper } from "$lib/components/builders/PlayingCard";
	import { animate } from "motion";
	const cards = createCards<PlayingCardTwo>(2);
	
	
</script>


<div class="grid grid-flow-row grid-cols-5">
	
	{#each $cards as card (card.state.id)}
		<div class='w-[235px] h-[331px] overflow-hidden'>
			
				<svelte:component this={Card} state={$cards[card.state.id].state} bind:this={$cards[card.state.id].self}>
					<img src='https://placehold.co/235x331' alt={`Card_${card.state.id}`} />
				</svelte:component>
		</div>
		
	{/each}

</div>
