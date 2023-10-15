import type CardStore from './cards';
import type GameTimer from './timer';
import type { GameSettings } from '$lib/components/Game/game';
import type { Status } from '$lib/components/PlayingCardThree/card';
// Work in progress.....
export type GameRule =
	| ((cardsPlayed: CardsPlayed, hand: CardStore, timer: GameTimer) => boolean | Promise<boolean>)
	| (() => true)
	| (() => void);
export type CardPlayed =
	| { _id: number; _value: number; _prevVal: Status; _currentVal: Status }
	| -1;
export type CardsPlayed = [c1: CardPlayed, c2: CardPlayed];

export default class Game implements GameSettings {
	public playSize: number = 2;
	public controls: boolean = false;
	private cardsPlayed: CardsPlayed = [-1, -1];
	public gameRules: Set<GameRule> = new Set([]);
	public gameWon: boolean = false;
	constructor(public hand: CardStore, public timer: GameTimer) {
		// Testing
		const gr: GameRule = (cardsPlayed) => {
			if (cardsPlayed[0] !== -1 && cardsPlayed[1] !== -1) {
				return cardsPlayed[0]._value === cardsPlayed[1]._value;
			}
			return false;
		};
		this.gameRules.add(gr);
		return this;
	}
	private _err(message: string) {
		throw new Error(message);
	}
	public gameResult(): Promise<boolean> {
		return new Promise<boolean>((resolve) => {
			let rulesFailed = 0;
			this.gameRules.forEach((rule) => {
				if (rule(this.cardsPlayed, this.hand, this.timer) !== true) rulesFailed++;
				return;
			});
			console.log(rulesFailed);
			if (rulesFailed === 0) resolve(true);
			resolve(false);
		});
	}
	get c1(): CardPlayed {
		return this.cardsPlayed[0];
	}
	get c2(): CardPlayed {
		return this.cardsPlayed[1];
	}
	private set c1(card) {
		this.cardsPlayed[0] = card;
	}
	private set c2(card) {
		this.cardsPlayed[1] = card;
	}
	public resetPlayed(card: 1 | 2 | null = null): void {
		card === null ? (this.cardsPlayed = [-1, -1]) : null;
		card === 1 ? (this.cardsPlayed = [-1, this.c2]) : null;
		card === 2 ? (this.cardsPlayed = [this.c1, -1]) : null;
	}
	public playCard(card: CardPlayed): CardsPlayed | false {
		if (this.c1 === -1 && this.c2 === -1) {
			this.c1 = card;
			return this.cardsPlayed;
		}
		if (this.c1 !== -1 && this.c2 === -1) {
			this.c2 = card;
			return this.cardsPlayed;
		}
		if (this.c2 !== -1 && this.c1 === -1) {
			this.c1 = card;
			return this.cardsPlayed;
		} else {
			return false;
		}
	}

	get played() {
		return {
			cards: (): CardsPlayed => this.cardsPlayed,
			noCardsPlayed: (): boolean => {
				return this.cardsPlayed[0] === -1 && this.cardsPlayed[1] === -1;
			},
			count: (): number => {
				return this.cardsPlayed.filter((cp) => cp !== -1).length;
			}
		};
	}
	public startGame() {
		if (this.gameRules.size === 0) return this._err('No Game Rules.');
		return this.timer.start();
	}
}
