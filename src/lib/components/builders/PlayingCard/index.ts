import type { Status } from '$lib/stores/cards';
import { animate } from 'motion';
import type { Tweened } from 'svelte/motion';
import type { Writable } from 'svelte/store';

export type CardState = {
	status: Writable<'FACEDOWN' | 'FACEUP'>;
	rotation: Tweened<number>;
};
export const flipper = (node: HTMLDivElement, s: Status) => {
	return {
		update(s: Status) {
			animate(
				node,
				{ rotateY: s === 'FACEUP' ? 360 : 0 },
				{ duration: 1, direction: s === 'FACEDOWN' ? 'reverse' : 'normal', easing: 'linear' }
			);
		},
		destroy() {
			return;
		}
	};
};
export default function playingcard<E extends HTMLElement = HTMLDivElement>(
	node: E,
	{ rotation }: { rotation: number }
) {
	//node.addEventListener('click', cardState.flip);

	return {
		update({ rotation }: { flip: () => void; rotation: number }) {
			const styles = `transform: rotate3d(0,1,0, ${rotation}deg);`;
			node.setAttribute('style', styles);
		},
		destroy() {
			//node.removeEventListener('click', cardState.flip);
			node.remove();
			console.log('Card Destroyed');
		}
	};
}
