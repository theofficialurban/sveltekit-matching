import type IGameHandler from './GameHandler';

type GameEvent = {
	time: number;
	type: IGameHandler['Action'];
	data: IGameHandler['SubjectData'];
};
export default interface IEventLog {
	GameEvent: GameEvent;
}
