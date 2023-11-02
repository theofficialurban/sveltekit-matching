import { quadInOut } from 'svelte/easing';
import { tweened, type Spring, type Tweened, spring } from 'svelte/motion';
import { derived, type Readable } from 'svelte/store';
type CustomTweens = {
	fill: Tweened<number>;
	rotation: Tweened<number>;
	bounce: Spring<number>;
};
type CustomTweensNumber = {
	fill: number;
	rotation: number;
	bounce: number;
};
type TweensStore = Readable<InteractivityParams>;
type InteractivityParams = CustomTweensNumber & {
	tweens: CustomTweens;
	showAnimation: (b?: boolean) => Promise<void>;
	options?: Options;
};
type Options = {
	axis?: 'x' | 'y' | 'z';
	allowFlip?: boolean;
	bounceDistance?: number;
};
const makeTweens = (): CustomTweens => {
	return {
		fill: tweened(0, { duration: 1000, easing: quadInOut }),
		rotation: tweened(0, { duration: 1000, easing: quadInOut }),
		bounce: spring(0, { stiffness: 0.1, damping: 0.2 })
	};
};
// type Interactivity = {
// 	rotation: Tweened<number>;
// 	fill: Tweened<number>;
// 	bounce: Spring<number>;

// 	axis?: 'x' | 'y' | 'z';
// 	allowFlip?: boolean;
// };
const interactivityOptions = (options?: Options): TweensStore => {
	const tweens = makeTweens();

	const showAnimation = (useRotation: boolean = false) => {
		return new Promise<void>((resolve) => {
			tweens.fill.set(0, { duration: 0 });
			tweens.rotation.set(0, { duration: 0 });
			tweens.fill.set(1, { duration: 1000 }).then(() => {
				if (useRotation) {
					tweens.rotation.set(360).then(() => resolve());
				} else {
					resolve();
				}
			});
		});
	};
	const ds = derived([tweens.fill, tweens.rotation, tweens.bounce], ([f, r, b]) => {
		return { fill: f, rotation: r, bounce: b, tweens, showAnimation, options };
	});
	return ds;
};
function interactivity(
	node: SVGElement,
	{ rotation, fill, bounce, tweens, options }: InteractivityParams
) {
	const child = node.getElementsByTagNameNS('http://www.w3.org/2000/svg', 'path');

	/**
	 * @method getAxis(axis) - Gets the correct axis for transform
	 * @param a The axis
	 * @returns The correct axis configuration for transform
	 */
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
	/**
	 * @method setFillOpacity() - Sets the opacity of the fill
	 * @param {o} - The fill opacity
	 */
	const setFillOpacity = (o: string) => {
		for (let index = 0; index < child.length; index++) {
			child.item(index)?.setAttribute('fill-opacity', o);
		}
	};
	setFillOpacity(fill.toString());
	/**
	 * @method setRotation(rot)
	 * @param {r} - The rotation
	 * @returns {string} The CSS transform string
	 */
	const setRotation = (r: string) => {
		return `rotate3d(${getAxis(options?.axis ?? 'y')}, ${r}deg)`;
	};
	setRotation(rotation.toString());
	/**
	 * @method setTranslateY(y) - Sets the y transform
	 * @param r The translation
	 * @returns {string} The transform string
	 */
	const setTranslateY = (r: string) => {
		return `translateY(${r}px)`;
	};
	setTranslateY(bounce.toString());
	/**
	 * @method setStrokeWidth(w) - Sets stroke width
	 * @param w - Stroke width
	 */
	const setStrokeWidth = (w: string) => {
		for (let index = 0; index < child.length; index++) {
			child.item(index)?.setAttribute('stroke-width', w);
		}
	};
	/**
	 * @handler handleIn()
	 * @event pointerenter
	 * Handles the bounce when hovered
	 */
	const handleIn = () => {
		const bounceDistance = options?.bounceDistance ?? -10;
		tweens.bounce.set(bounceDistance, { soft: 10 });
		tweens.rotation.set(360, { duration: 1000 });
	};
	/**
	 * @handler handleOut()
	 * @event pointerleave
	 * Handles the bounce when pointerexit
	 */
	const handleOut = () => {
		tweens.bounce.set(0, { soft: 10 });
		tweens.rotation.set(0, { duration: 1000 });
	};
	node.addEventListener('pointerenter', handleIn);
	node.addEventListener('pointerleave', handleOut);
	const allowFlip = options?.allowFlip ?? false;

	return {
		destroy() {
			node.removeEventListener('pointerenter', handleIn);
			node.removeEventListener('pointerleave', handleOut);
		},
		update({ fill, bounce, rotation }: InteractivityParams) {
			setFillOpacity(fill.toString());

			setStrokeWidth((1 - fill).toString());
			const style = `transform:
			${setTranslateY(bounce.toString())}
			${allowFlip ? setRotation(rotation.toString()) : ''}
			`;
			node.setAttribute('style', style);
		}
	};
}

export { interactivity, interactivityOptions as options };
