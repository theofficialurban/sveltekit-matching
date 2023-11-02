import CardGame from '$lib/classes/CardGame';
import { browser } from '$app/environment';
import Level from '$lib/classes/Level';
import supabaseClient from '$lib/supabaseClient';
import type { PageLoad } from './$types';
import type { Row } from '$lib/supabaseClient';

import { isUndefined } from 'lodash-es';
import Face1 from '$lib/assets/card-face.png';
import Face2 from '$lib/assets/card2.png';
import Cover from '$lib/assets/card-cover.png';

const getLevel = async (l: string): Promise<Level> => {
	const { data, error } = await supabaseClient.from('levels').select('*');
	const lvls = data as Row<'levels'>[];
	const search = lvls.find((lvl) => parseInt(l) === lvl['lvl#']);
	if (!data || error || isUndefined(search)) {
		return new Level(0, {
			count: 1,
			pair: true,
			timer: { time: 60 },
			faceImages: [Face1, Face2],
			cover: Cover
		});
	}
	return new Level(search['lvl#']!, {
		color: search.color,
		pair: true,
		count: search.cards ?? 1,
		timer: { time: search.time ?? 60 },
		faceImages: [Face1, Face2],
		cover: Cover,
		adminControls: search.adminControls ?? false
	});
};
export const load = (async ({ params, depends }) => {
	console.log('ran');
	const level = await getLevel(params.level);
	const user = browser ? (await supabaseClient.auth.getUser()).data.user : null;
	depends('app:game');
	return { level, user, lvl: params.level, game: new CardGame(level, user) };
}) satisfies PageLoad;
