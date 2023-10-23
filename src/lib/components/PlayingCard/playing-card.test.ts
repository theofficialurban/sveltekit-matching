import { it, expect } from 'vitest';
import { fireEvent, render } from '@testing-library/svelte';
import PlayingCard from './playing-card.svelte';
import FaceUp from '$lib/assets/card-face.png';
it('Testing', async () => {
	const card = render(PlayingCard, {
		state: {
			_id: 1,
			_status: 'FACEDOWN',
			_value: 1,
			_image: FaceUp
		}
	});

	const div = card.getByRole('img');
	await fireEvent.click(div);
	expect(div).toHaveProperty('src');
});
