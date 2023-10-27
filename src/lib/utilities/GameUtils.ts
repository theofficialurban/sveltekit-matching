import type ICardGame from '$lib/types/CardGame';
import { has, get } from 'lodash-es';
import { gameActions } from '$lib/classes/CardGame';

const gameUtils = {
	/**
	 * @prop gameAction
	 * Fetches the unique symbol for the action in the game.
	 * @param action the simple action string (start|end|match|no_match)
	 * @returns
	 */
	gameAction(action: ICardGame['ACTION_KEY']): symbol {
		if (has(gameActions, action)) {
			return get(gameActions, action);
		} else {
			return Symbol('GAME_ERROR');
		}
	}
};

export default gameUtils;
