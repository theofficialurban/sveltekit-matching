import Level from '$lib/classes/Level';
import supabaseClient from '$lib/supabaseClient';
import type { PageLoad } from './$types';

export const load = (async () => {
	const { error, data } = await supabaseClient.from('levels').select('*');
	if (error) throw error;
	const lvls = data.map(
		(l) =>
			new Level(l['lvl#']!, {
				color: { from: l.color.from, to: l.color.to },
				count: l.cards ?? 1,
				pair: true,
				timer: { time: l.time ?? 60 }
			})
	);
	return { levels: lvls };
}) satisfies PageLoad;
