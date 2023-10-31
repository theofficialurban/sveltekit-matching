import { quadInOut } from 'svelte/easing';
import { tweened } from 'svelte/motion';

export const showAnimation = (fn: () => void) => {
	return new Promise<void>((resolve) => {
		tweens.fill.set(0, { duration: 0 });
		tweens.rotation.set(0, { duration: 0 });
		setTimeout(() => {
			fn();
			setTimeout(() => {
				tweens.fill.set(1).then(() => {
					tweens.rotation.set(360).then(() => resolve());
				});
			}, 1200);
		}, 1000);
	});
};
export const tweens = {
	fill: tweened(0, { duration: 2000, easing: quadInOut }),
	rotation: tweened(0, { duration: 500, easing: quadInOut })
};

export function rotation(node: SVGElement, { rotation, fill }: { rotation: number; fill: number }) {
	const child = node.getElementsByTagNameNS('http://www.w3.org/2000/svg', 'path');
	const setFillOpacity = (o: string) => {
		child.item(0)?.setAttribute('fill-opacity', o);
		//child.item(0)?.setAttribute('stroke-width', (1 - fill).toString());
		child.item(1)?.setAttribute('fill-opacity', o);
		child.item(2)?.setAttribute('fill-opacity', o);
		child.item(3)?.setAttribute('fill-opacity', o);
		child.item(4)?.setAttribute('fill-opacity', o);
		child.item(5)?.setAttribute('fill-opacity', o);
		child.item(6)?.setAttribute('fill-opacity', o);
		child.item(7)?.setAttribute('fill-opacity', o);
	};
	setFillOpacity(fill.toString());
	const setRotation = (r: string) => {
		node.setAttribute('style', `transform: rotate3d(0,1,0, ${r}deg)`);
	};
	setRotation(rotation.toString());
	return {
		update({ rotation, fill }: { rotation: number; fill: number }) {
			setFillOpacity(fill.toString());
			setRotation(rotation.toString());
		}
	};
}
