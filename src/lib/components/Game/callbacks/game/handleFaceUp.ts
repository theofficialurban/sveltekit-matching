import type { Callback } from '$lib/classes/Builder';
import { GameStatus } from '$lib/classes/Game';
import type { CardLike, CardMove } from '$lib/types/Card';

const handleFaceUp: Callback<CardLike | CardMove> = (game, detail, type, preventDefault) => {
	if (type !== 'faceup') return;
	if (game.gameStatus !== GameStatus.INPROGRESS) return preventDefault();
	if (game.hand.countFaceUp() === 2) return preventDefault();
	if (game.hand.countFaceUp() !== game.cardsPlayed.count) return preventDefault();
	if (game.cardsPlayed.attemptPlay({ _id: detail._id, _value: detail._value })) {
		if (game.cardsPlayed.count === 2) {
			game
				.gameResult()
				.then(({ one, two }) => {
					if (one && two) {
						setTimeout(() => {
							game.hand.removeCards(one._id, two._id);
							game.score += 2;
							game.cardsPlayed.reset(null);
						}, 1000);
					}
				})
				.catch(() => setTimeout(() => game.cardsPlayed.reset(null), 1500));
		}
	} else {
		if (game.cardsPlayed.count === 2) {
			setTimeout(() => game.cardsPlayed.reset(null), 500);
			preventDefault();
			return;
		}
	}
};
export default handleFaceUp;
