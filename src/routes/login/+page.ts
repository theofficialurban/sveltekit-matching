import supabaseClient from '$lib/supabaseClient';
import type { PageLoad } from './$types';

export const load = (async () => {
	console.log(await supabaseClient.auth.getUser());
	return {};
}) satisfies PageLoad;
