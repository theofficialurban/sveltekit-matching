// import Level from '$lib/classes/Level';
// import type { Row } from '$lib/supabaseClient';
// import { isUndefined } from 'lodash-es';
// import type { LayoutServerLoad } from './$types';
// import Face1 from '$lib/assets/card-face.png';
// import Face2 from '$lib/assets/card2.png';
// import Cover from '$lib/assets/card-cover.png';
// import supabaseClient from '$lib/supabaseClient';
// const getLevel = async (l: string): Promise<Level> => {
// 	const { data, error } = await supabaseClient.from('levels').select('*');
// 	const lvls = data as Row<'levels'>[];
// 	const search = lvls.find((lvl) => parseInt(l) === lvl['lvl#']);
// 	if (!data || error || isUndefined(search)) {
// 		return new Level(0, {
// 			count: 1,
// 			pair: true,
// 			timer: { time: 60 },
// 			faceImages: [Face1, Face2],
// 			cover: Cover
// 		});
// 	}
// 	return new Level(search['lvl#']!, {
// 		color: search.color,
// 		pair: true,
// 		count: search.cards ?? 1,
// 		timer: { time: search.time ?? 60 },
// 		faceImages: [Face1, Face2],
// 		cover: Cover,
// 		adminControls: search.adminControls ?? false
// 	});
// };
// export const load: LayoutServerLoad = (async ({ params }) => {
// 	const level = params.level;

// 	const foundLvl = await getLevel(level);
// 	return { level: JSON.stringify(foundLvl) };
// }) satisfies LayoutServerLoad;
