import type PlayingCard from '$lib/types/Card';
type CardLike = PlayingCard['CardLike'];
export default class Matcher extends Map<number, CardLike> {
	static get [Symbol.species]() {
		return Map;
	}
	// private set(key: number, value: CardLike) {
	// 	this.set(key, value);
	// 	return this;
	// }
}
