import type CardStore from '$lib/stores/cards';
import { Rule, type GameRule } from './Rule';
import PlayedCards, { type CardLikeData } from './Played';
import type PlayingCard from '$lib/types/Card';
import type { EasingFunction } from 'svelte/transition';
import { tweened, type Tweened } from 'svelte/motion';
import createEventCallback, { type Callback, type Handler } from './Builder';
import type { CardLike, CardMove } from '$lib/types/Card';

export interface GameSettings {
	playSize: number;
	controls: boolean;
	cardsPlayed: PlayedCards;
	gameStatus: GameStatus;
	gameRules: Rule[];
	hand: PlayingCard['Store'];
	timer: Tweened<number>;
	gameHandlers: {
		facedown: Handler<CardLike | CardMove>;
		faceup: Handler<CardLike | CardMove>;
		move: Handler<CardLike | CardMove>;
	};
}

type TimerOptions = {
	duration: number;
	easing: EasingFunction;
};
export enum GameStatus {
	WIN,
	LOSS,
	INPROGRESS,
	NOTSTARTED,
	ERROR
}
export function resolveStatus(status: GameStatus) {
	switch (status) {
		case GameStatus.WIN:
			return 'Win';
		case GameStatus.ERROR:
			return 'Error';
		case GameStatus.LOSS:
			return 'Loss';
		case GameStatus.INPROGRESS:
			return 'In Progress';
		case GameStatus.NOTSTARTED:
			return 'Not Started';
	}
}
export default class Game implements GameSettings {
	public playSize: GameSettings['playSize'] = 2;
	public controls: GameSettings['controls'] = false;
	public timer: Tweened<number>;
	public cardsPlayed: PlayedCards;
	public gameRules: GameSettings['gameRules'] = [];
	public gameStatus: GameStatus = GameStatus.NOTSTARTED;
	public gameHandlers: GameSettings['gameHandlers'] = {
		facedown: () => console.log('Face Down'),
		faceup: () => console.log('Face Up'),
		move: () => console.log('Move')
	};

	constructor(public hand: CardStore, timerOptions: TimerOptions) {
		// Setup the timer
		this.timer = tweened(timerOptions.duration / 1000, {
			easing: timerOptions.easing,
			duration: timerOptions.duration
		});
		this.cardsPlayed = new PlayedCards(this);
		const myRule: GameRule = (game) => {
			return new Promise<boolean>((resolve, reject) => {
				const {
					cardsPlayed: { one, two }
				} = game;
				if (one && two) {
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
	public gameResult(): Promise<{ one: CardLikeData; two: CardLikeData }> {
		return new Promise<{ one: CardLikeData; two: CardLikeData }>((resolve, reject) => {
			const rules: Rule[] = this.gameRules;
			const promises: Promise<void>[] = [];
			rules.forEach((rule) => promises.push(rule.attempt(this)));
			Promise.all(promises).then(
				() => {
					const { one, two } = this.cardsPlayed;
					resolve({ one, two });
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
			}
		};
	}
	setHandler(type: keyof GameSettings['gameHandlers'], callback: Callback<CardLike | CardMove>) {
		switch (type) {
			case 'faceup': {
				this.gameHandlers.faceup = createEventCallback(this, callback);
				break;
			}
			case 'facedown': {
				this.gameHandlers.facedown = createEventCallback(this, callback);
				break;
			}
			case 'move': {
				this.gameHandlers.move = createEventCallback(this, callback);
				break;
			}
			default: {
				this._err('Error Setting Handler');
				break;
			}
		}
		return;
	}
	public startGame() {
		if (this.gameRules.length === 0) return this._err('No Game Rules.');
		return this.timer.set(0);
	}
}
