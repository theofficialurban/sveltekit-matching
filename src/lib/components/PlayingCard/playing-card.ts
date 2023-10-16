import type { CardTransition } from './card';

/**
 * @action cardflip - Handles the animation of the card via Svelte Actions
 * @param node The node of the card
 */
export default function cardflip(node: HTMLElement, { rotation, fade }: CardTransition) {
	const styles = `opacity: ${fade * fade * 100}%; transform: rotate3d(0,1,0,${rotation}deg);`;
	node.setAttribute('style', styles);

	return {
		update({ rotation, fade }: CardTransition) {
			const styles = `opacity: ${fade * fade * 100}%; transform: rotate3d(0,1,0,${rotation}deg);`;
			node.setAttribute('style', styles);
		}
	};
}
