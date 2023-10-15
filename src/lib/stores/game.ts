import type CardStore from './cards';
import type GameTimer from './timer';
import type { GameSettings } from '$lib/components/Game/game';
// Work in progress.....
export default class Game implements GameSettings {
	public playSize: number = 2;
	public controls: boolean = false;
	constructor(public hand: CardStore, public timer: GameTimer) {
		return this;
	}
	public startGame() {
		console.log(this.timer);
		return this.timer.start();
	}
}
