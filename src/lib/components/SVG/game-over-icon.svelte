<script lang="ts">
	import { onMount } from 'svelte';
	import { quintOut } from 'svelte/easing';
	import { draw } from 'svelte/transition';

	export let width: string = '200px';
	export let height: string = '200px';
	export let stroke: string = 'red';
	export let strokeWidth: number = 0.5;
	onMount(() => setTimeout(() => (show = true), 1000));
	let show = false;
</script>

<svg
	fill="none"
	{height}
	{width}
	version="1.1"
	id="Layer_1"
	xmlns="http://www.w3.org/2000/svg"
	xmlns:xlink="http://www.w3.org/1999/xlink"
	viewBox="0 0 290.477 290.477"
	xml:space="preserve"
	><g id="SVGRepo_bgCarrier" stroke-width="0" /><g
		id="SVGRepo_tracerCarrier"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
	{#if show}
		<g id="SVGRepo_iconCarrier">
			<g>
				<g>
					<g>
						<polygon
							transition:draw={{ duration: 2000, easing: quintOut, speed: 0.5 }}
							{stroke}
							stroke-width={strokeWidth}
							points="66.667,109.524 28.571,109.524 28.571,119.048 19.048,119.048 19.048,185.714 28.571,185.714 28.571,195.238 66.667,195.238 66.667,185.714 76.191,185.714 76.191,147.619 47.62,147.619 47.62,157.143 66.667,157.143 66.667,176.19 57.144,176.19 57.144,185.714 38.096,185.714 38.096,176.19 28.571,176.19 28.571,128.571 38.096,128.571 38.096,119.048 57.144,119.048 57.144,128.571 76.191,128.571 76.191,119.048 66.667,119.048 "
						/>
						<path
							transition:draw={{ duration: 2000, easing: quintOut, speed: 0.5 }}
							{stroke}
							stroke-width={strokeWidth}
							d="M138.096,119.048h-4.762v-9.524H95.238v9.524h-4.762v9.524h-4.762v66.667h9.524v-28.571h38.095v28.571h9.524v-66.667 h-4.762V119.048z M133.334,157.143H95.238v-19.048h4.762v-9.524h4.762v-9.524h19.048v9.524h4.762v9.524h4.762V157.143z"
						/>
						<polygon
							transition:draw={{ duration: 2000, easing: quintOut, speed: 0.5 }}
							{stroke}
							stroke-width={strokeWidth}
							points="178.571,142.271 170.386,109.524 152.381,109.524 152.381,195.238 161.906,195.238 161.906,119.048 162.949,119.048 172.472,157.143 184.672,157.143 194.196,119.048 195.239,119.048 195.239,195.238 204.763,195.238 204.763,109.524 186.758,109.524 "
						/>
						<polygon
							transition:draw={{ duration: 2000, easing: quintOut, speed: 0.5 }}
							{stroke}
							stroke-width={strokeWidth}
							points="266.667,119.048 266.667,109.524 214.287,109.524 214.287,195.238 266.667,195.238 266.667,185.714 223.811,185.714 223.811,157.143 261.906,157.143 261.906,147.619 223.811,147.619 223.811,119.048 "
						/>
						<path
							{stroke}
							transition:draw={{ duration: 2000, easing: quintOut, speed: 0.5 }}
							stroke-width={strokeWidth}
							d="M66.667,204.762H28.571v9.524h-9.524v66.667h9.524v9.524h38.095v-9.524h9.524v-66.667h-9.524V204.762z M66.667,223.81 v47.619h-9.524v9.524H38.096v-9.524h-9.524V223.81h9.524v-9.524h19.048v9.524H66.667z"
						/>
						<polygon
							transition:draw={{ duration: 2000, easing: quintOut, speed: 0.5 }}
							{stroke}
							stroke-width={strokeWidth}
							points="133.334,261.905 128.571,261.905 128.571,271.429 123.811,271.429 123.811,280.952 104.763,280.952 104.763,271.429 100.001,271.429 100.001,261.905 95.238,261.905 95.238,204.762 85.714,204.762 85.714,271.429 90.477,271.429 90.477,280.952 95.238,280.952 95.238,290.476 133.334,290.476 133.334,280.952 138.096,280.952 138.096,271.429 142.857,271.429 142.857,204.762 133.334,204.762 "
						/>
						<polygon
							{stroke}
							transition:draw={{ duration: 2000, easing: quintOut, speed: 0.5 }}
							stroke-width={strokeWidth}
							points="152.381,290.476 204.763,290.476 204.763,280.952 161.906,280.952 161.906,252.381 200.001,252.381 200.001,242.857 161.906,242.857 161.906,214.286 204.763,214.286 204.763,204.762 152.381,204.762 "
						/>
						<path
							{stroke}
							transition:draw={{ duration: 2000, easing: quintOut, speed: 0.5 }}
							stroke-width={strokeWidth}
							d="M261.906,247.619h9.524v-33.333h-9.524v-9.524h-47.619v85.714h9.524v-32.062l38.095,29.629v2.433h9.524v-7.09 l-33.743-26.243h24.219V247.619z M252.381,247.619h-28.552l-0.019,4.757v-38.09h28.571v9.524h9.524v14.286h-9.524V247.619z"
						/>
						<path
							{stroke}
							transition:draw={{ duration: 2000, easing: quintOut, speed: 0.5 }}
							stroke-width={strokeWidth}
							d="M195.239,104.762h19.048v-9.524h-19.048V28.571C195.239,12.814,182.425,0,166.667,0h-47.619 C103.29,0,90.477,12.814,90.477,28.571v66.667H71.43v9.524h19.048H195.239z M100.001,28.571c0-10.505,8.543-19.048,19.048-19.048 h47.619c10.505,0,19.048,8.543,19.048,19.048v66.667h-85.715V28.571z"
						/>
						<polygon
							{stroke}
							transition:draw={{ duration: 2000, easing: quintOut, speed: 0.5 }}
							stroke-width={strokeWidth}
							points="147.62,19.048 138.096,19.048 138.096,28.571 114.287,28.571 114.287,38.095 138.096,38.095 138.096,76.19 147.62,76.19 147.62,38.095 171.43,38.095 171.43,28.571 147.62,28.571 "
						/>
					</g>
				</g>
			</g>
		</g>{/if}</svg
>
