import BicycleCardComponent from './bicycle-card.svelte';
import BicycleCardDeck from '$lib/classes/Deck';
const Deck = new BicycleCardDeck();
const Card = BicycleCardComponent;
export { Card, Deck };
