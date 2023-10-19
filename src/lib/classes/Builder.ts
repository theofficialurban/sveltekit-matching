import type Game from './Game';

export type Handler<D, E extends CustomEvent = CustomEvent<D>> = (event: E) => void | Promise<void>;
export type Callback<D> = (
	game: Game,
	detail: D,
	type: string,
	preventDefault: () => void
) => void | Promise<void>;
export default function createEventCallback<D, E extends CustomEvent = CustomEvent<D>>(
	game: Game,
	callbackFn: Callback<D>
) {
	const handler: Handler<D, E> = ({ detail, preventDefault, type }: E) => {
		return callbackFn(game, detail, type, preventDefault);
	};
	return handler;
}
