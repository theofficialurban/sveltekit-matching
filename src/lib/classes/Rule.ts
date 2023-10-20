import type GameVitals from '$lib/stores/game';
import { uniqueId } from 'lodash-es';

/**
 * @type GameRule
 * @description A rule for game win. All rules must evaluate to true for a win.
 */
export type GameRule =
	| ((game: GameVitals) => Promise<boolean>)
	| (() => Promise<boolean>)
	| (() => Promise<void>);

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
	public attempt(game: GameVitals): Promise<void> {
		return new Promise((resolve, reject) => {
			this._rule(game)
				.then(() => resolve())
				.catch(() => reject(`Rule ID: ${this._id} | Name: ${this.ruleName} | FAILED`));
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
