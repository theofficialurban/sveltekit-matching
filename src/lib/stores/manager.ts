import type { EasingFunction } from 'svelte/transition';
import CardStore from './cards';
import GameVitals from './game';
import Timer from './timer';
type Settings = {
	playSize: number;
	controls: boolean;
	cards: {
		count: number;
		pairs: boolean;
		faceImgs?: string[];
	};
	timer: {
		duration: number;
		easing?: EasingFunction;
	};
};
export default class GameManager {
	public hand: CardStore;
	public vitals: GameVitals;
	public timer: Timer;
	static instance: GameManager | null = null;
	private constructor(public settings: Settings) {
		this.hand = new CardStore(
			this.settings.cards.count,
			this.settings.cards.pairs,
			this.settings.cards.faceImgs
		);
		this.vitals = new GameVitals(this);
		this.timer = new Timer(this, this.settings.timer.duration, this.settings.timer.easing);
		return this;
	}
	static init(settings: Settings) {
		if (this.instance) return this.instance;
		this.instance = new GameManager(settings);
		return this.instance;
	}
}
