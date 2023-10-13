import { tweened, type Tweened } from 'svelte/motion';
import type { CardTransition } from './card';

/**
 * Transitions
 * @prop rotation - A tween 0 -> 360 which flips the card
 * @prop fade - -1 -> 1 applied with x^2 allowing a fade at 180 to show the flip of the card
 */
const transitions: { rotation: Tweened<number>; fade: Tweened<number> } = {
	rotation: tweened(0, { duration: 1000 }),
	fade: tweened(-1, { duration: 1000 })
};

/**
 * @action cardflip - Handles the animation of the card via Svelte Actions
 * @param node The node of the card
 *
 */
export function cardflip(node: HTMLElement, { rotation, fade }: CardTransition) {
	const styles = `opacity: ${fade * fade * 100}%; transform: rotate3d(0,1,0,${rotation}deg);`;
	node.setAttribute('style', styles);

	return {
		update({ rotation, fade }: CardTransition) {
			const styles = `opacity: ${fade * fade * 100}%; transform: rotate3d(0,1,0,${rotation}deg);`;
			node.setAttribute('style', styles);
		}
	};
}

export default transitions;
