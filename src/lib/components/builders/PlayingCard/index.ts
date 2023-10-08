import type { Status } from '$lib/stores/cards';
import { animate } from 'motion';
import type { Tweened } from 'svelte/motion';
import type { Writable } from 'svelte/store';

export type CardState = {
	status: Writable<'FACEDOWN' | 'FACEUP'>;
	rotation: Tweened<number>;
};
export const flipper = (node: HTMLDivElement, s: Status) => {
	if (s === 'FACEUP') return;
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
