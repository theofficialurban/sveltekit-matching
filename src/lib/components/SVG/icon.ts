import { isUndefined } from 'lodash-es';
import { quadInOut } from 'svelte/easing';
import { tweened, type Tweened } from 'svelte/motion';
export type CustomTweens = { fill: Tweened<number>; rotation: Tweened<number> };
export const showAnimation = (t: CustomTweens, useRotation: boolean = false) => {
	return new Promise<void>((resolve) => {
		const { fill, rotation } = t;
		fill.set(0, { duration: 0 });
		rotation.set(0, { duration: 0 });
		fill.set(1, { duration: 1000 }).then(() => {
			if (useRotation) {
				rotation.set(360).then(() => resolve());
			} else {
				resolve();
			}
		});
	});
};
export const makeTweens = (): CustomTweens => {
	return {
		fill: tweened(0, { duration: 1000, easing: quadInOut }),
		rotation: tweened(0, { duration: 1000, easing: quadInOut })
	};
};
export function interactivity(
	node: SVGElement,
	{
		rotation,
		fill,
		axis,
		bounce,
		allowFlip
	}: { rotation: number; bounce: number; fill: number; axis?: 'x' | 'y' | 'z'; allowFlip?: boolean }
) {
	const child = node.getElementsByTagNameNS('http://www.w3.org/2000/svg', 'path');
	//const existing = getComputedStyle(node).transform.replace('none', '');
	const getAxis = (a: 'x' | 'y' | 'z') => {
		switch (a) {
			case 'x':
				return '1,0,0';
			case 'y':
				return '0,1,0';
			case 'z':
				return '0,0,1';
			default:
				return '0,1,0';
		}
	};
	const setFillOpacity = (o: string) => {
		for (let index = 0; index < child.length; index++) {
			child.item(index)?.setAttribute('fill-opacity', o);
		}
	};
	setFillOpacity(fill.toString());
	const setRotation = (r: string) => {
		return `rotate3d(${getAxis(axis ?? 'y')}, ${r}deg)`;
	};
	setRotation(rotation.toString());
	const setTranslateY = (r: string) => {
		return `translateY(${r}px)`;
	};
	setTranslateY(bounce.toString());
	const setStrokeWidth = (w: string) => {
		for (let index = 0; index < child.length; index++) {
			child.item(index)?.setAttribute('stroke-width', w);
		}
	};

	return {
		update({ rotation, fill, bounce }: { rotation: number; fill: number; bounce: number }) {
			setFillOpacity(fill.toString());

			setStrokeWidth((1 - fill).toString());
			const style = `transform:
			${!isUndefined(allowFlip) ? setRotation(rotation.toString()) : ''}
			${setTranslateY(bounce.toString())}
			`;
			node.setAttribute('style', style);
		}
	};
}
export function rotation(
	node: SVGElement,
	{ rotation, fill, axis }: { rotation: number; fill: number; axis?: 'x' | 'y' | 'z' }
) {
	const child = node.getElementsByTagNameNS('http://www.w3.org/2000/svg', 'path');
	const getAxis = (a: 'x' | 'y' | 'z') => {
		switch (a) {
			case 'x':
				return '1,0,0';
			case 'y':
				return '0,1,0';
			case 'z':
				return '0,0,1';
			default:
				return '0,1,0';
		}
	};
	const setFillOpacity = (o: string) => {
		for (let index = 0; index < child.length; index++) {
			child.item(index)?.setAttribute('fill-opacity', o);
		}
	};
	setFillOpacity(fill.toString());
	const setRotation = (r: string) => {
		node.setAttribute('style', `transform: rotate3d(${getAxis(axis ?? 'y')}, ${r}deg)`);
	};

	setRotation(rotation.toString());
	const setStrokeWidth = (w: string) => {
		for (let index = 0; index < child.length; index++) {
			child.item(index)?.setAttribute('stroke-width', w);
		}
	};

	return {
		update({ rotation, fill }: { rotation: number; fill: number }) {
			setFillOpacity(fill.toString());
			setRotation(rotation.toString());
			setStrokeWidth((1 - fill).toString());
		}
	};
}
