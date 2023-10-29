import type CardGame from '$lib/classes/CardGame';

import type { Rule } from '$lib/classes/Rule';

import type { EasingFunction } from 'svelte/transition';

export default interface ICardGame {
	GAME: CardGame;
	GAMERULE: Rule;

	OPTIONS: {
		adminControls?: boolean;

		timer: { time: number; duration: number; delay?: number; easing?: EasingFunction };
	};
}
