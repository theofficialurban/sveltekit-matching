import NotPictured from '$lib/assets/not-pictured.png';
import Face1 from '$lib/assets/card-face.png';
import Face2 from '$lib/assets/card2.png';
import Cover from '$lib/assets/card-cover.png';
import BicycleCardComponent from './bicycle-card.svelte';
import CardGame from '$lib/classes/CardGame';
const Game = new CardGame({
	pair: true,
	count: 5,
	faceImages: [Face1, Face2, NotPictured],
	cover: Cover,
	adminControls: true
});
const Card = BicycleCardComponent;
export { Card, Game };
