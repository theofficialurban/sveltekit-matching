import { uniqueId } from 'lodash-es';
import type CardStore from '$lib/stores/cards';
import type GameTimer from '$lib/stores/timer';
import type Game from './Game';
import type PlayedCards from './Played';

/**
 * @type GameRule
 * @description A rule for game win. All rules must evaluate to true for a win.
 */
export type GameRule =
	| ((cardsPlayed: PlayedCards, hand: CardStore, timer: GameTimer) => boolean | Promise<boolean>)
	| (() => true)
	| (() => void);

/**
 * @class Rule - A rule for the game, all rules must evaluate to true for a win.
 * @private _rule - GameRule
 * @public ruleName - A public name for this rule.
 */
export class Rule {
	private _id: number = parseInt(uniqueId());
	constructor(public ruleName: string, private _rule: GameRule) {
		return this;
	}
	/**
	 * @public attempt() - Attempt the rule on the game.
	 * @param game the game to run the rule against.
	 * @returns Promise<boolean>
	 */
	public attempt(game: Game): Promise<boolean> {
		return new Promise((resolve, reject) => {
			if (this._rule(game.cardsPlayed, game.hand, game.timer)) {
				return resolve(true);
			} else {
				reject(false);
			}
		});
	}
	/**
	 * @get info() - Fetch rule info.
	 */
	get info() {
		return {
			id: this._id,
			name: this.ruleName,
			rule: this._rule
		};
	}
}
