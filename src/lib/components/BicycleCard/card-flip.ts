import type BicycleCard from '$lib/types/BicycleCard';

/**
 * @action cardflip - Handles the animation of the card via Svelte Actions
 * @param node The node of the card
 */
export default function cardflip(
	node: HTMLElement,
	{ rotation, fade }: BicycleCard['Transition']['number']
) {
	const styles = `opacity: ${fade * fade * 100}%; transform: rotate3d(0,1,0,${rotation}deg);`;
	node.setAttribute('style', styles);
	return {
		update({ rotation, fade }: BicycleCard['Transition']['number']) {
			const styles = `opacity: ${fade * fade * 100}%; transform: rotate3d(0,1,0,${rotation}deg);`;
			node.setAttribute('style', styles);
		}
	};
}
