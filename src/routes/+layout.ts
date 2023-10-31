import CardGame from '$lib/classes/CardGame';
import NotPictured from '$lib/assets/not-pictured.png';
import Face1 from '$lib/assets/card-face.png';
import Face2 from '$lib/assets/card2.png';
import Cover from '$lib/assets/card-cover.png';
import type { LayoutLoad } from './$types';
const game = new CardGame({
	pair: true,
	count: 5,
	faceImages: [Face1, Face2, NotPictured],
	cover: Cover,
	timer: { time: 60, duration: 60000 },
	adminControls: true
});

export const load: LayoutLoad = () => {
	return {
		game
	};
};
