<script lang="ts">
	import type { PageData } from './$types';
	import supabaseClient from '$lib/supabaseClient';
	export let data: PageData;
	//supabaseClient.auth.signInWithOAuth({ provider: 'discord' });
	supabaseClient.auth.getSession().then((u) => console.log(u));
</script>
