import type { Callback } from '$lib/classes/Builder';
import { GameStatus } from '$lib/classes/Game';
import type { CardLike, CardMove } from '$lib/types/Card';

const handleFaceDown: Callback<CardLike | CardMove> = (game, detail, type, preventDefault) => {
	if (type !== 'facedown') return;
	if (game.gameStatus !== GameStatus.INPROGRESS) return preventDefault();
	try {
		game.cardsPlayed.remove(detail._id);
	} catch (error) {
		console.error(error);
	}
};

export default handleFaceDown;
