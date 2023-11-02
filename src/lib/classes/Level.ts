import Face2 from '$lib/assets/card2.png';
import Face1 from '$lib/assets/card-face.png';
import type BicycleCard from '$lib/types/BicycleCard';
import Cover from '$lib/assets/card-cover.png';
import NotPictured from '$lib/assets/not-pictured.png';
import { isUndefined } from 'lodash-es';
import type { EasingFunction } from 'svelte/transition';
import { linear } from 'svelte/easing';
/**
 * Interface Implementation
 */
interface CLevel {
	level: number;
	adminControls: boolean;
	cardOptions: BicycleCard['Options'];
}
/**
 * @type {Options} - Options for the level
 */
type Options = {
	adminControls?: boolean;
	color?: { from: string; to: string };
	timer?: { time: number; delay?: number; easing?: EasingFunction };
};
export type LevelOptions = Options & BicycleCard['Options'];
/**
 * @class Level - A game level
 * @implements {CLevel}
 * Includes
 * 1) cardOptions
 * 2) adminControls T/F
 * 3) color
 * 4) timerOptions
 */
export default class Level implements CLevel {
	readonly cardOptions: BicycleCard['Options'];
	readonly adminControls: boolean = false;
	readonly color: { from: string; to: string } = { from: '#FFFFFF', to: '#FFFFFF' };
	readonly timerOptions: { time: number; delay?: number; easing?: EasingFunction };
	constructor(readonly level: number, options: LevelOptions) {
		const { faceImages, count, pair, cover, adminControls, color } = options;
		// If no color, default to white
		if (!isUndefined(color)) {
			this.color.from = color.from ?? '#FFFFFF';
			this.color.to = color.to ?? '#FFFFFF';
		}
		// Set timer
		this.timerOptions = {
			time: options.timer?.time ?? 60,
			delay: options.timer?.delay ?? 0,
			easing: options.timer?.easing ?? linear
		};
		// Set Card Options
		this.cardOptions = {
			faceImages: isUndefined(faceImages) ? [Face1, Face2, NotPictured] : faceImages,
			cover: isUndefined(cover) ? Cover : cover,
			count: isUndefined(count) ? 1 : count,
			pair: isUndefined(pair) ? false : pair
		};
		// Admin Controls T/F
		this.adminControls = adminControls ?? false;
		return this;
	}
}
