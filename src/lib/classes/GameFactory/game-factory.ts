import CardGame from '../CardGame';
import type { LevelOptions } from '../Level';
import Level from '../Level';

export default class GameFactory {
	static newGame = (level: Level) => {
		return new Promise<CardGame>((resolve) => {
			const ng = new CardGame(level);
			return resolve(ng);
		});
	};
	static newLevel = (lvl: number, options: LevelOptions): Level => {
		return new Level(lvl, options);
	};
}
