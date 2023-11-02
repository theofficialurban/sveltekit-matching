import CardGame from '$lib/classes/CardGame';
import type Level from '$lib/classes/Level';
import type { PageLoad } from './$types';

export const load = (async ({ parent }) => {
	const { level } = await parent();
	const lvl = JSON.parse(level) as Level;
	const game = new CardGame(lvl);
	return { game };
}) satisfies PageLoad;
