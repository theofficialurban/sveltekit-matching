import supabaseClient from '$lib/server/supabaseClient';
export async function handle({ event, resolve }) {
	event.locals.supabase = supabaseClient;
	const response = await resolve(event);

	return response;
}
