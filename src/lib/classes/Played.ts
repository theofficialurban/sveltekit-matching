import type { CardLike, CardMove } from '$lib/types/Card';
import type Game from './Game';

export type CardLikeData = CardLike | CardMove | null;
export type CardContainer = [CardLikeData, CardLikeData];

/**
 * @class PlayedCards
 * Holds information about the currently played cards.
 */
export default class PlayedCards {
	private _cardsPlayed: CardContainer = [null, null];

	constructor(private _game: Game) {
		return this;
	}
	/**
	 * @private _findSlot()
	 * Finds the next open slot or returns null if there is none.
	 * @returns 0 | 1 | null
	 */
	private _findSlot(): 0 | 1 | null {
		if (!this._cardsPlayed[0]) return 0;
		if (!this._cardsPlayed[1]) return 1;
		return null;
	}
	get one() {
		return this._cardsPlayed[0];
	}
	get two() {
		return this._cardsPlayed[1];
	}
	get count() {
		let ct = 0;
		if (this._cardsPlayed[0]) ct += 1;
		if (this._cardsPlayed[1]) ct += 1;
		return ct;
	}
	/**
	 * @public remove()
	 * @param cardId - ID of the card to remove from currently played.
	 * @returns boolean
	 */
	remove(cardId: number) {
		if (this._cardsPlayed[0]?._id === cardId) {
			this._cardsPlayed[0] = null;
			return true;
		}
		if (this._cardsPlayed[1]?._id === cardId) {
			this._cardsPlayed[1] = null;
			return true;
		}
		return false;
	}
	/**
	 * @public reset(slot) - Will reset and flip back over the slot specified, or both
	 * if null is passed.
	 * @param slot 1|0|null
	 * @returns CardsContainer
	 */
	reset(slot: 1 | 0 | null): CardContainer {
		if (slot === 0 && this._cardsPlayed[0])
			this._game.hand.setStatus('FACEDOWN', this._cardsPlayed[0]._id);
		if (slot === 1 && this._cardsPlayed[1])
			this._game.hand.setStatus('FACEDOWN', this._cardsPlayed[1]._id);
		if (slot === null && this._cardsPlayed[1] && this._cardsPlayed[0])
			this._game.hand.setStatus('FACEDOWN', this._cardsPlayed[0]._id, this._cardsPlayed[1]._id);
		slot !== null ? (this._cardsPlayed[slot] = null) : (this._cardsPlayed = [null, null]);
		return this._cardsPlayed;
	}
	/**
	 * @public attemptPlay()
	 * @param card - The card attempting to be played
	 * @returns boolean
	 */
	attemptPlay(card: CardLikeData): boolean {
		const slot = this._findSlot();
		if (slot === null) return false;
		if (slot !== null) {
			this._cardsPlayed[slot] = card;
			return true;
		}
		return false;
	}
}
