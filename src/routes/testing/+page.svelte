<script lang="ts">
	import supabaseClient from '$lib/supabaseClient';

	//supabaseClient.auth.signInWithOAuth({ provider: 'discord' });
	const insert = async () => {
		const {
			data: { user }
		} = await supabaseClient.auth.getUser();
		const { error } = await supabaseClient
			.from('results')
			.insert({ score: 2, level: 1, time: 0.4, user: user?.id });
		if (error) throw error;
	};
</script>

<button on:click={insert}>ff</button>
