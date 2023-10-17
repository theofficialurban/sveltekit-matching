import type { Timer } from '$lib/types/Timer';
/**
 * @function TimerHandler()
 * @param fn A callback function that accepts the detail from the event and the type.
 * @param preventDefault boolean indicating whether to prevent action.
 * @returns A timer event handler.
 */
export default function TimerHandler(fn: Timer['EventCallback']): Timer['Handler'] {
	const handler: Timer['Handler'] = ({ detail, type, preventDefault }: CustomEvent) => {
		return fn(detail, type, preventDefault);
	};
	return handler;
}
