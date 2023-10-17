import type CardStore from '$lib/stores/cards';
import type GameTimer from '$lib/stores/timer';
import { Rule, type GameRule } from './Rule';
import PlayedCards, { type Final } from './Played';
import type PlayingCard from '$lib/types/Card';
import FlipHandler from './handlers/FlipHandler';

/**
 * @interface GameSettings - The interface implemented by the Game class.
 *  @property playSize - The number of cards able to be face up at one time.
 *  @property controls - Admin controls for testing.
 *  @property cardsPlayed - Pending...
 *  @property gameWon - Game won t/f
 *  @property gameRules - Rules for game win.
 *  @property hand - The card store
 *  @property timer - The timer store
 *  @property gameHandlers - Handlers for the game events.
 */
export interface GameSettings {
	playSize: number;
	controls: boolean;
	cardsPlayed: PlayedCards;
	gameWon: boolean;
	gameRules: Rule[];
	hand: PlayingCard['Store'];
	timer: GameTimer;
	gameHandlers: {
		facedown: PlayingCard['Events']['Handler'];
		faceup: PlayingCard['Events']['Handler'];
		move: PlayingCard['Events']['Handler'];
	};
}

export default class Game implements GameSettings {
	public playSize: GameSettings['playSize'] = 2;
	public controls: GameSettings['controls'] = false;
	public cardsPlayed: PlayedCards;
	public gameRules: GameSettings['gameRules'] = [];
	public gameWon: GameSettings['gameWon'] = false;
	public gameHandlers: GameSettings['gameHandlers'] = {
		facedown: () => console.log('Face Down'),
		faceup: () => console.log('Face Up'),
		move: () => console.log('Move')
	};

	constructor(public hand: CardStore, public timer: GameTimer) {
		this.cardsPlayed = new PlayedCards(hand);
		const myRule: GameRule = (game) => {
			return new Promise<boolean>((resolve, reject) => {
				const {
					cardsPlayed: { final }
				} = game;
				if (final) {
					const { one, two } = final;
					return one._value === two._value ? resolve(true) : reject();
				}
			});
		};
		const testingRule: Rule = new Rule('Testing Rule', myRule);
		this.gameRules.push(testingRule);
		return this;
	}
	private _err(message: string) {
		throw new Error(message);
	}
	public gameResult(): Promise<Final> {
		return new Promise<Final>((resolve, reject) => {
			const rules: Rule[] = this.gameRules;
			const promises: Promise<void>[] = [];
			rules.forEach((rule) => promises.push(rule.attempt(this)));
			Promise.all(promises).then(
				() => {
					if (this.cardsPlayed.final) {
						resolve(this.cardsPlayed.final);
					}
				},
				() => reject('Rule(s) Failed')
			);
		});
	}
	get handlers() {
		return {
			game: {
				handleMove: this.gameHandlers.move,
				handleFaceDown: this.gameHandlers.facedown,
				handleFaceUp: this.gameHandlers.faceup
			},
			timer: this.timer.handlers
		};
	}
	set handleMove(fn: PlayingCard['Events']['Callback']) {
		this.gameHandlers.move = FlipHandler(fn);
	}
	set handleFaceUp(fn: PlayingCard['Events']['Callback']) {
		this.gameHandlers.faceup = FlipHandler(fn);
	}
	set handleFaceDown(fn: PlayingCard['Events']['Callback']) {
		this.gameHandlers.facedown = FlipHandler(fn);
	}

	public startGame() {
		if (this.gameRules.length === 0) return this._err('No Game Rules.');
		return this.timer.start();
	}
}
