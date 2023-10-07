import type { Tweened } from 'svelte/motion';
import type { Writable } from 'svelte/store';

export type CardState = {
	status: Writable<'FACEDOWN' | 'FACEUP'>;
	rotation: Tweened<number>;
	flip: () => void;
};
export default function playingcard<E extends HTMLElement = HTMLDivElement>(
	node: E,
	cardState: { flip: () => void; rotation: number }
) {
	node.addEventListener('click', cardState.flip);

	return {
		update({ rotation }: { flip: () => void; rotation: number }) {
			const styles = `transform: rotate3d(0,1,0, ${rotation}deg);`;
			node.setAttribute('style', styles);
		},
		destroy() {
			node.removeEventListener('click', cardState.flip);
			node.remove();
			console.log('Card Destroyed');
		}
	};
}
