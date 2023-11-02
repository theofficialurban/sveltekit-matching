<script lang="ts">
	import type { PageData } from './$types';
	import supabaseClient from '$lib/server/supabaseClient';
	import Button from '$lib/components/ui/button/button.svelte';
	supabaseClient.auth.getSession().then((s) => console.log(s));
	export let data: PageData;
</script>

<Button
	on:click={async () => {
		const login = await supabaseClient.auth.signInWithOAuth({
			provider: 'discord',
			options: { redirectTo: 'http://localhost:5173/login/callback' }
		});
		console.log(login);
	}}>Login</Button
>
