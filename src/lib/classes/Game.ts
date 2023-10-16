import type CardStore from '$lib/stores/cards';
import type GameTimer from '$lib/stores/timer';
import type { CardMove } from '$lib/components/PlayingCard/card';
import { Rule } from './Rule';
import PlayedCards from './Played';
import type { ComponentEvents } from 'svelte';
import type PlayingCard from '$lib/components/PlayingCard/playing-card.svelte';
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
	gameRules: Map<number, Rule>;
	hand: CardStore;
	timer: GameTimer;
	gameHandlers: PlayEventHandlers;
}

export type CardComponentEvents =
	| ComponentEvents<PlayingCard>['facedown']
	| ComponentEvents<PlayingCard>['faceup']
	| ComponentEvents<PlayingCard>['move'];
/**
 * @typedef PlayEventHandler
 * @description A handler for the custom card events from the playing-card.svelte component.
 */
export type PlayEventHandler = (e: CardComponentEvents) => void | Promise<void>;
/**
 * @typedef PlayEventHandlers
 * @description The object containing the three handlers for card plays.
 */
export type PlayEventHandlers = {
	faceup: PlayEventHandler;
	facedown: PlayEventHandler;
	move: PlayEventHandler;
};
export type PlayHandlerCallback = (
	d: { _id: number; _value: number } | CardMove,
	type: string,
	preventDefault: () => void
) => void | Promise<void>;
/**
 * @function PlayHandler()
 * @param fn A callback function that accepts the detail from the event.
 * @param preventDefault boolean indicating whether or not to prevent default action.
 * @returns The event handler.
 */
export function PlayHandler(fn: PlayHandlerCallback): PlayEventHandler {
	const handler: PlayEventHandler = ({ type, detail, preventDefault }: CardComponentEvents) => {
		return fn(detail, type, preventDefault);
	};
	return handler;
}

export default class Game implements GameSettings {
	public playSize: number = 2;
	public controls: boolean = false;
	public cardsPlayed: PlayedCards = new PlayedCards();
	public gameRules: Map<number, Rule> = new Map<number, Rule>([]);
	public gameWon: boolean = false;
	public gameHandlers: PlayEventHandlers = {
		facedown: () => console.log('Face Down'),
		faceup: () => console.log('Face Up'),
		move: () => console.log('Move')
	};

	constructor(public hand: CardStore, public timer: GameTimer) {
		const myRule = () => true;
		const testingRule: Rule = new Rule('Testing Rule', myRule);
		this.gameRules.set(testingRule.info.id, testingRule);
		return this;
	}
	private _err(message: string) {
		throw new Error(message);
	}
	public gameResult(): Promise<boolean> {
		return new Promise<boolean>((resolve, reject) => {
			this.gameRules.forEach((rule) => {
				rule.attempt(this).catch(() => {
					reject();
					this._err('Rule Failed');
				});
				return;
			});
			resolve(true);
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
	set handleMove(fn: PlayEventHandler) {
		this.gameHandlers.move = fn;
	}
	set handleFaceUp(fn: PlayEventHandler) {
		this.gameHandlers.faceup = fn;
	}
	set handleFaceDown(fn: PlayEventHandler) {
		this.gameHandlers.facedown = fn;
	}

	public startGame() {
		if (this.gameRules.size === 0) return this._err('No Game Rules.');
		return this.timer.start();
	}
}
