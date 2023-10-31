import Face2 from '$lib/assets/card2.png';
import Face1 from '$lib/assets/card-face.png';
import type BicycleCard from '$lib/types/BicycleCard';
import Cover from '$lib/assets/card-cover.png';
import NotPictured from '$lib/assets/not-pictured.png';
import { isUndefined } from 'lodash-es';
interface CLevel {
	level: number;
	adminControls: boolean;
	cardOptions: BicycleCard['Options'];
}
type Options = { adminControls?: boolean; color?: { from: string; to: string } };
type LevelOptions = Options & BicycleCard['Options'];
export default class Level implements CLevel {
	readonly cardOptions: BicycleCard['Options'];
	readonly adminControls: boolean = false;
	readonly color: { from: string; to: string } = { from: '#FFFFFF', to: '#FFFFFF' };
	constructor(readonly level: number, options: LevelOptions) {
		const { faceImages, count, pair, cover, adminControls, color } = options;
		if (!isUndefined(color)) {
			this.color.from = color.from ?? '#FFFFFF';
			this.color.to = color.to ?? '#FFFFFF';
		}
		this.cardOptions = {
			faceImages: isUndefined(faceImages) ? [Face1, Face2, NotPictured] : faceImages,
			cover: isUndefined(cover) ? Cover : cover,
			count: isUndefined(count) ? 1 : count,
			pair: isUndefined(pair) ? false : pair
		};
		this.adminControls = adminControls ?? false;
		return this;
	}
}
