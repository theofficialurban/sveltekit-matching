import CardGame from '../CardGame';
import type { LevelOptions } from '../Level';
import Level from '../Level';

export default class GameFactory {
	static newGame = (level: Level) => {
		return new CardGame(level);
	};
	static newLevel = (lvl: number, options: LevelOptions): Level => {
		return new Level(lvl, options);
	};
}
