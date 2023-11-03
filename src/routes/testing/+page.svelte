<script lang="ts">
	import { browser } from '$app/environment';
	import { animate } from 'motion';
	import { Pane } from 'tweakpane';
	let bindings = {
		position: { x: 0, y: 0, z: 0 }
	};
	let f = { a: 'aaa' };
	const thing = (node: SVGCircleElement, b: { position: { x: number; y: number; z: number } }) => {
		return {
			update({ position: { x, y, z } }: { position: { x: number; y: number; z: number } }) {
				animate(node, { x, y, z }, { duration: 1 });
			}
		};
	};
	if (browser) {
		const pane = new Pane();

		const bind = pane.addBinding(bindings, 'position');
		bind.on('change', (e) => (bindings.position = e.value));
	}
</script>

{f.a}
<input bind:value={bindings.position.x} />
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
	<circle use:thing={bindings} cx="20" cy="20" r="5" fill="red" />
</svg>
