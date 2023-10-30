<script>
	import '../app.postcss';
	import Button from '$lib/components/ui/button/button.svelte';
	import PlayingCardIcon from '$lib/assets/cardicon.png';
	import Icon from '$lib/components/SVG/icon.svelte';
</script>

<div class="container w-screen h-screen">
	<div class="bg-opacity-20 fixed w-screen left-0 h-[50px]">
		<center
			><slot name="header"
				><span class="text-3xl font-extrabold text-center justify-center">HEADER</span></slot
			></center
		>
	</div>
	<div class=" fixed left-0 w-[100px] h-screen flow-root">
		<slot name="sidebar">
			<center>
				<span class="p-3 w-[75px] h-[75px]"><Icon /></span>
				<div class="grid grid-flow-row gap-20 px-4 justify-items-start">
					<Button>FFFFF</Button>
					<Button>FFFFF</Button>
					<Button>FFFFF</Button>
					<Button>FFFFF</Button>
					<Button>FFFFF</Button>
				</div>
			</center>
		</slot>
	</div>
	<slot />
</div>
