import type PlayingCard from '$lib/types/Card';

const handleFaceDown: PlayingCard['Events']['Callback'] = (game, detail, type) => {
	if (type !== 'facedown') return;
	try {
		game.cardsPlayed.removePlay(detail._id);
	} catch (error) {
		console.error(error);
	}
	console.table(game.cardsPlayed.current);
};

export default handleFaceDown;
