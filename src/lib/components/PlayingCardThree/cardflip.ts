import type { CardTransition } from './card';

export default function flipper(node: HTMLElement, { rotation, fade }: CardTransition) {
	const styles = `opacity: ${fade * fade * 100}%; transform: rotate3d(0,1,0,${rotation}deg);`;
	node.setAttribute('style', styles);

	return {
		update({ rotation, fade }: CardTransition) {
			const styles = `opacity: ${fade * fade * 100}%; transform: rotate3d(0,1,0,${rotation}deg);`;
			node.setAttribute('style', styles);
		}
	};
}
