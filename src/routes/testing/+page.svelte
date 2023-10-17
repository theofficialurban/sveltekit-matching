<script lang="ts">
	import Testing from '$lib/components/Testing/testing.svelte';

	let yes = false;
</script>

<Testing on:testing={() => console.log('Testing event.')} />
