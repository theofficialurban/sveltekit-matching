<script lang="ts">
	import { quintOut } from 'svelte/easing';
	import { draw } from 'svelte/transition';

	let yes = false;
</script>

<button on:click={() => (yes = !yes)}>Go</button>
<svg width="300" height="300" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
	{#if yes}
		<g id="SVGRepo_bgCarrier" stroke-width="0" />
		<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />
		<g id="SVGRepo_iconCarrier">
			<g id="gemini">
				<path
					transition:draw={{ duration: 3000, easing: quintOut }}
					fill="none"
					stroke="deepskyblue"
					stroke-width="0.5px"
					stroke-linejoin="round"
					d="M16.63,7.32a2.59,2.59,0,0,0,.48,0,2.68,2.68,0,0,0,.4,0l1.68-.24a1,1,0,1,0-.28-2l-1.68.24a.75.75,0,0,1-.26,0L14.88,5c-.12,0-.25,0-.37,0h-4l-.11,0-.21,0L8,5.35a.57.57,0,0,1-.26,0A17.6,17.6,0,0,0,6,5.11a1,1,0,0,0-1,1,1,1,0,0,0,.93,1l1.58.22a2.66,2.66,0,0,0,.89,0l1.17-.2V17.87l-1.17-.2a3,3,0,0,0-.89,0c-.46.07-1.35.2-1.57.22a1,1,0,0,0,0,2,18.06,18.06,0,0,0,1.83-.24.57.57,0,0,1,.26,0l2.18.36a3.73,3.73,0,0,0,.47,0H14.4a3.73,3.73,0,0,0,.48,0L17,19.65a.76.76,0,0,1,.26,0l1.68.24a1,1,0,1,0,.28-2l-1.68-.24a2.89,2.89,0,0,0-.88,0l-1.17.2V7.12ZM11.54,7h1.92v11.1H11.54Z"
				/>
				<path
					transition:draw={{ duration: 3000, easing: quintOut }}
					fill="none"
					stroke="deepskyblue"
					stroke-width="0.5px"
					stroke-linejoin="round"
					d="M21,1H4A3,3,0,0,0,1,4V21a3,3,0,0,0,3,3H21a3,3,0,0,0,3-3V4A3,3,0,0,0,21,1Zm1,20a1,1,0,0,1-1,1H4a1,1,0,0,1-1-1V4A1,1,0,0,1,4,3H21a1,1,0,0,1,1,1Z"
				/>
			</g>
		</g>
	{/if}
</svg>
