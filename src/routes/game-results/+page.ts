import supabaseClient from '$lib/supabaseClient';
import type { PageLoad } from './$types';
export const load = (async () => {
	const { error, data } = await supabaseClient.from('results').select('*, level(*)');
	if (error) throw error;
	console.log(data);
	return { data };
}) satisfies PageLoad;
