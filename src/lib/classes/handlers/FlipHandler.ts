import type PlayingCard from '$lib/types/Card';

/**
 * @function FlipHandler()
 * @param fn A callback function that accepts the detail from the event.
 * @param preventDefault boolean indicating whether or not to prevent default action.
 * @returns The event handler.
 */
export default function FlipHandler(
	fn: PlayingCard['Events']['Callback']
): PlayingCard['Events']['Handler'] {
	const handler: PlayingCard['Events']['Handler'] = ({ type, detail, preventDefault }) => {
		return fn(detail, type, preventDefault);
	};
	return handler;
}
