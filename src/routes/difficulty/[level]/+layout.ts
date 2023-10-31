import type { LayoutLoad } from './$types';
import CardGame from '$lib/classes/CardGame';
import Level from '$lib/classes/Level';
export const load = (async ({ params }) => {
	const level = params.level;
	const admin = true;
	const getLevel = (l: string): Level => {
		switch (l) {
			case 'one': {
				return new Level(1, { count: 5, pair: true, adminControls: admin });
			}
			case 'two': {
				return new Level(2, {
					count: 8,
					pair: true,
					adminControls: admin,
					color: { from: '#ff0f7b', to: '#f89b29' }
				});
			}
			case 'three': {
				return new Level(3, { count: 10, pair: true, adminControls: admin });
			}
			default: {
				return new Level(1, { count: 1, pair: true, adminControls: admin });
			}
		}
	};
	const game = new CardGame(getLevel(level));
	return { game, level };
}) satisfies LayoutLoad;
