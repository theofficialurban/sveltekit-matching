import supabaseClient from '$lib/supabaseClient';
export async function handle({ event, resolve }) {
	event.locals.supabase = supabaseClient;
	const response = await resolve(event);

	return response;
}
