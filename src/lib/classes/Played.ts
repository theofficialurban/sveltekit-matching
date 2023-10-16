import type { CardMove, PlayingCard } from '$lib/components/PlayingCard/card';
import type CardStore from '$lib/stores/cards';
export type ContainedCard = PlayingCard | CardMove | -1;
export type CardContainer = [ContainedCard, ContainedCard];
export default class PlayedCards {
	public _cardsPlayed: CardContainer = [-1, -1];

	constructor(private _hand: CardStore) {
		return this;
	}
	public removePlay(cardId: number): Promise<boolean> {
		return new Promise((resolve, reject) => {
			this._cardsPlayed.forEach((card, index) => {
				if (card === -1) return;
				if (card._id === cardId) {
					this._cardsPlayed[index] = -1;
					resolve(true);
				}
			});
			reject('Card Not Found');
		});
	}
	public makePlay(card: PlayingCard): boolean {
		if (!this.getCard('one')) {
			this.one = card;
			console.table([this.getCard('one'), this.getCard('two')]);
			return true;
		} else if (!this.getCard('two')) {
			this.two = card;
			console.table([this.getCard('one'), this.getCard('two')]);
			return true;
		}

		return false;
	}
	/**
	 * @public getCard(one|two) => ContainedCard | null
	 * @param card - one or two
	 * @returns
	 */
	public getCard(card: 'one' | 'two', asString: boolean = false): ContainedCard | string | null {
		switch (card) {
			case 'one':
				if (this._cardsPlayed[0] === -1) return null;
				if (asString === true) return JSON.stringify(this._cardsPlayed[0]);
				return this._cardsPlayed[0];
			case 'two':
				if (this._cardsPlayed[1] === -1) return null;
				if (asString === true) return JSON.stringify(this._cardsPlayed[1]);
				return this._cardsPlayed[1];

			default:
				return null;
		}
	}
	/**
	 * @property count - The number of cards currently played.
	 */
	get count() {
		let count = 0;
		if (this._cardsPlayed[0] !== -1) count++;
		if (this._cardsPlayed[1] !== -1) count++;
		return count;
	}
	/**
	 * @property current - The current cards.
	 */
	get current() {
		return {
			one: this._cardsPlayed[0],
			two: this._cardsPlayed[1]
		};
	}
	/**
	 * @public reset() - Resets the current cards
	 * @returns void
	 */
	public reset() {
		const { one, two } = this.current;
		if (one === -1 || two === -1) return;
		this._hand.faceDown(one._id, two._id);
		this._cardsPlayed = [-1, -1];
	}
	set one(val: ContainedCard) {
		this._cardsPlayed[0] = val;
	}
	set two(val: ContainedCard) {
		this._cardsPlayed[1] = val;
	}
}
