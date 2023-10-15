import type CardStore from './cards';
import type GameTimer from './timer';

// Work in progress.....
export default class Game {
	constructor(public deck: CardStore, public timer: GameTimer) {
		return this;
	}
}
