<script lang="ts">
	import { draw } from 'svelte/transition';
	import { options, interactivity } from './icon';
	import { quintOut } from 'svelte/easing';
	import { SvelteComponent, onMount } from 'svelte';
	import { spring } from 'svelte/motion';
	export let width = '75px';
	export let height = '75px';
	export class IconThree extends SvelteComponent {}
	let show = false;
	onMount(() => {
		show = true;
	});
	const intOptions = options();
</script>

<button on:click={() => (show = !show)}>Reset Animation</button>
{#if show}
	<svg
		{height}
		{width}
		version="1.1"
		role="img"
		use:interactivity={$intOptions}
		id="Layer_1"
		xmlns="http://www.w3.org/2000/svg"
		xmlns:xlink="http://www.w3.org/1999/xlink"
		viewBox="0 0 448 448"
		xml:space="preserve"
		fill="#000000"
		><g id="SVGRepo_bgCarrier" stroke-width="0" /><g
			id="SVGRepo_tracerCarrier"
			stroke-linecap="round"
			stroke-linejoin="round"
		/><g id="SVGRepo_iconCarrier">
			<g
				transform="translate(0 -1020.36)"
				shape-rendering="auto"
				image-rendering="auto"
				color-rendering="auto"
				color-interpolation="sRGB"
			>
				<path
					fill-opacity="0"
					transition:draw|global={{ duration: 2000, speed: 2, delay: 500, easing: quintOut }}
					stroke="deepskyblue"
					stroke-width="1"
					on:introend={() => $intOptions.showAnimation()}
					style="fill:#5A3392;"
					d="M104.062,1020.36c-22.022,0-40.031,18.009-40.031,40.031v78.5c-0.024,0.272-0.066,0.541-0.062,0.813 v12.031c0.082,10.626,15.98,10.626,16.062,0v-5.375h0.031v-85.969c0-13.434,10.534-24.094,23.969-24.094h240 c13.434,0,24,10.66,24,24.094v211.656c0.426,10.272,15.919,10.194,16-0.313c-0.12-70.392-0.063-140.889-0.063-211.344 c0-22.022-17.885-40.031-39.906-40.031H104.062z M71.062,1208.922c-4.073,0.464-7.135,3.932-7.094,8.031v12.031 c-0.003,0.272,0.038,0.541,0.062,0.813v198.531c0,22.022,18.01,40.031,40.031,40.031h240c22.022,0,39.906-18.009,39.906-40.031 c-0.082-30.459,0.063-60.975,0.063-91.375c0.056-4.853-4.186-8.638-9-8.031c-3.929,0.464-6.851,3.741-7,7.656v91.75 c0,13.434-10.566,23.969-24,23.969h-240c-13.435,0-23.969-10.535-23.969-23.969V1222.36h-0.031v-5.406 C80.084,1212.115,75.865,1208.337,71.062,1208.922z"
				/>
				<path
					fill-opacity="0"
					transition:draw|global={{ duration: 2000, speed: 2, delay: 500, easing: quintOut }}
					stroke="deepskyblue"
					stroke-width="1"
					style="fill:#EE746C;"
					d="M104.042,1036.341h240c13.434,0,23.976,10.661,23.976,24.095v367.914 c0,13.434-10.542,23.977-23.976,23.977h-240c-13.435,0-23.977-10.543-23.977-23.977v-367.914 C80.065,1047.003,90.607,1036.341,104.042,1036.341L104.042,1036.341z"
				/>
				<path
					fill-opacity="0"
					stroke="deepskyblue"
					stroke-width="1"
					transition:draw|global={{ duration: 2000, speed: 2, delay: 500, easing: quintOut }}
					style="fill:#FB9761;"
					d="M113.855,1053.339c-12.336,0-22.031,9.789-22.031,22.125v337.846 c0,12.336,9.695,22.031,22.031,22.031h220.375c12.336,0,22.031-9.695,22.031-22.031v-337.846c0-12.336-9.695-22.125-22.031-22.125 H113.855z"
				/>
				<g>
					<path
						fill-opacity="0"
						stroke="deepskyblue"
						stroke-width="1"
						transition:draw|global={{ duration: 2000, speed: 2, delay: 500, easing: quintOut }}
						style="fill:#FFFFFF;"
						d="M256.137,1061.307c0.181-0.006,0.363-0.006,0.544,0c4.418,0,8,3.582,8,8s-3.582,8-8,8s-8-3.582-8-8 c-0.01-4.207,3.24-7.705,7.438-8H256.137z"
					/>
					<path
						fill-opacity="0"
						stroke="deepskyblue"
						transition:draw|global={{ duration: 2000, speed: 2, delay: 500, easing: quintOut }}
						stroke-width="1"
						style="fill:#FFFFFF;"
						d="M288.074,1061.307c0.23-0.01,0.46-0.01,0.689,0h31.906c13.16-0.004,24.094,10.836,24.093,24v31.873 c-0.025,4.436-3.64,8.012-8.076,7.986c-4.401-0.023-7.962-3.586-7.987-7.986v-31.873c0.001-4.512-3.52-8.031-8.031-8.031h-31.906 c-4.419-0.02-7.986-3.615-7.967-8.035C280.814,1065.116,283.966,1061.68,288.074,1061.307z"
					/>
					<path
						fill-opacity="0"
						stroke="deepskyblue"
						stroke-width="1"
						transition:draw|global={{ duration: 2000, speed: 2, delay: 500, easing: quintOut }}
						style="fill:#FFFFFF;"
						d="M111.23,1363.307c4.418-0.086,8.07,3.424,8.156,7.842c0.002,0.104,0.002,0.209,0,0.313v31.906 c0,4.512,3.393,8.031,7.906,8.031h31.906c4.401-0.395,8.289,2.852,8.684,7.254c0.395,4.4-2.852,8.289-7.253,8.684 c-0.476,0.043-0.955,0.043-1.431,0h-31.906c-13.16,0-23.969-10.809-23.969-23.969v-31.906c-0.085-4.418,3.427-8.068,7.845-8.154 C111.19,1363.307,111.21,1363.307,111.23,1363.307L111.23,1363.307z"
					/>
					<path
						fill-opacity="0"
						stroke="deepskyblue"
						stroke-width="1"
						style="fill:#FFFFFF;"
						transition:draw|global={{ duration: 2000, speed: 2, delay: 500, easing: quintOut }}
						d="M191.324,1411.339c4.418,0,8,3.582,8,8s-3.582,8-8,8s-8-3.582-8-8 S186.906,1411.339,191.324,1411.339z"
					/>
				</g>
				<g>
					<path
						fill-opacity="0"
						stroke="deepskyblue"
						stroke-width="1"
						style="fill:#5A3392;"
						transition:draw|global={{ duration: 2000, speed: 2, delay: 500, easing: quintOut }}
						d="M205.203,1159.055l-41.693,72.166c-4.699,8.145-4.699,18.193,0,26.34l41.693,72.164 c8.182,14.189,29.495,14.189,37.677,0l41.575-72.164c4.699-8.146,4.699-18.195,0-26.34l-41.575-72.166 C234.698,1144.868,213.385,1144.868,205.203,1159.055L205.203,1159.055z"
					/>
					<path
						fill-opacity="0"
						stroke="deepskyblue"
						stroke-width="1"
						style="fill:#29A3EC;"
						transition:draw|global={{ duration: 2000, speed: 2, delay: 500, easing: quintOut }}
						d="M219.022,1167.089c2.413-4.18,7.629-4.18,10.039,0l41.575,72.164c1.857,3.217,1.857,7.174,0,10.395 l-41.575,72.164c-2.413,4.18-7.628,4.18-10.039,0l-41.575-72.164c-1.857-3.225-1.857-7.174,0-10.395L219.022,1167.089z"
					/>
					<path
						fill-opacity="0"
						stroke="deepskyblue"
						stroke-width="1"
						transition:draw|global={{ duration: 2000, speed: 2, delay: 500, easing: quintOut }}
						style="fill:#3CDEF6;"
						d="M220.318,1187.069c1.79-3.096,5.66-3.096,7.446,0l30.837,53.527c1.379,2.385,1.379,5.316,0,7.711 l-30.837,53.527c-1.79,3.102-5.66,3.102-7.446,0l-30.837-53.527c-1.379-2.389-1.379-5.322,0-7.711L220.318,1187.069z"
					/>
					<g>
						<path
							fill-opacity="0"
							stroke="deepskyblue"
							stroke-width="1"
							style="fill:#5A3392;"
							transition:draw|global={{ duration: 2000, speed: 2, delay: 500, easing: quintOut }}
							d="M71.072,1170.317c-4.07,0.469-7.129,3.936-7.087,8.031v12.049c0.002,4.436,3.6,8.029,8.035,8.027 c4.433-0.002,8.025-3.594,8.028-8.027v-12.049c0.05-4.418-3.492-8.041-7.91-8.09 C71.782,1170.255,71.426,1170.274,71.072,1170.317z"
						/>
						<path
							style="fill:#5A3392;"
							fill-opacity="0"
							stroke="deepskyblue"
							transition:draw|global={{ duration: 2000, speed: 2, delay: 500, easing: quintOut }}
							stroke-width="1"
							d="M375.031,1290.317c-4.07,0.469-7.129,3.936-7.087,8.031v12.049c0.002,4.436,3.6,8.029,8.035,8.027 c4.433-0.002,8.025-3.594,8.028-8.027v-12.049c0.05-4.418-3.492-8.041-7.91-8.09 C375.741,1290.255,375.385,1290.274,375.031,1290.317z"
						/>
					</g>
				</g>
			</g>
		</g></svg
	>
{/if}
