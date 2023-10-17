import type PlayingCard from '$lib/types/Card';

const handleFaceUp: PlayingCard['Events']['Callback'] = (game, detail, type, preventDefault) => {
	if (type !== 'faceup') return;
	if (game.hand.countFaceUp() === 2) return preventDefault();
	if (game.hand.countFaceUp() !== game.cardsPlayed.count) return preventDefault();
	if (game.cardsPlayed.makePlay({ _id: detail._id, _value: detail._value })) {
		if (game.cardsPlayed.count === 2) {
			game
				.gameResult()
				.then(({ one, two }) => {
					game.hand.removeCards(one._id, two._id);
					game.cardsPlayed.reset();
				})
				.catch(() => setTimeout(() => game.cardsPlayed.reset(true), 1000));
		}
	} else {
		if (game.cardsPlayed.count === 2) {
			game.cardsPlayed.reset();
			preventDefault();
			return;
		}
	}
};
export default handleFaceUp;
