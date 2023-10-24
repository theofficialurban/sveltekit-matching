import type PlayingCard from '$lib/types/Card';

/**
 * @action cardflip - Handles the animation of the card via Svelte Actions
 * @param node The node of the card
 */
export default function cardflip(
	node: HTMLElement,
	{ rotation, fade }: PlayingCard['Transition']['number']
) {
	const styles = `opacity: ${fade * fade * 100}%; transform: rotate3d(0,1,0,${rotation}deg);`;
	node.setAttribute('style', styles);
	return {
		update({ rotation, fade }: PlayingCard['Transition']['number']) {
			const styles = `opacity: ${fade * fade * 100}%; transform: rotate3d(0,1,0,${rotation}deg);`;
			node.setAttribute('style', styles);
		}
	};
}
