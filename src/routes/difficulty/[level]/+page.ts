import { browser } from '$app/environment';
import CardGame from '$lib/classes/CardGame';
import type Level from '$lib/classes/Level';
import supabaseClient from '$lib/supabaseClient';
import type { PageLoad } from './$types';

export const load = (async ({ parent }) => {
	const { level } = await parent();
	const lvl = JSON.parse(level) as Level;
	//const game = new CardGame(lvl);
	const user = browser ? (await supabaseClient.auth.getUser()).data.user : null;
	const game = new CardGame(lvl, user);
	return { game, user };
}) satisfies PageLoad;
