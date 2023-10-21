import type { EasingFunction } from 'svelte/transition';
import CardStore from './cards';
import GameVitals from './game';
import Timer from './timer';
import type PlayingCard from '$lib/types/Card';
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

	private _currentlyPlayed: Map<1 | 2, PlayingCard['CardLike'] | null> = new Map<
		1 | 2,
		PlayingCard['CardLike'] | null
	>();
	public vitals: GameVitals;
	public timer: Timer;
	static instance: GameManager | null = null;
	private constructor(public settings: Settings) {
		// Create the playing cards
		this.hand = new CardStore(
			this,
			this.settings.cards.count,
			this.settings.cards.pairs,
			this.settings.cards.faceImgs
		);
		// Create the game vitals
		this.vitals = new GameVitals(this);
		// Create the game timer
		this.timer = new Timer(this, this.settings.timer.duration, this.settings.timer.easing);
		// Set currently played to null.
		this._currentlyPlayed.set(1, null) && this._currentlyPlayed.set(2, null);
		return this;
	}

	static init(settings: Settings) {
		if (this.instance) return this.instance;
		this.instance = new GameManager(settings);
		return this.instance;
	}
}
