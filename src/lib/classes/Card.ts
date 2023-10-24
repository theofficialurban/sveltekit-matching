import type PlayingCard from '$lib/types/Card';
import { uniqueId, random } from 'lodash-es';
import NotPictured from '$lib/assets/not-pictured.png';
import type { Writable } from 'svelte/store';
type CardState = PlayingCard['State'];
//type HandStore = Writable<BicycleCard[]>;
type HandStore = Writable<Map<number, BicycleCard>>;
type UpdateCallback = (s: Map<number, BicycleCard>, card: [number, BicycleCard]) => void;
export default class BicycleCard {
	readonly #_id: number;
	readonly #_value: number;
	#_status: PlayingCard['Status'] = 'FACEDOWN';
	#_image: string = NotPictured;
	state: CardState;
	#_handStore: HandStore;
	constructor(_handStore: HandStore) {
		this.#_handStore = _handStore;

		this.#_id = parseInt(uniqueId());
		this.#_value = random(0, 100, false);
		this.state = {
			_id: this.#_id,
			_value: this.#_value,
			_status: 'FACEDOWN',
			_image: NotPictured
		};
		this.#_handStore.update((s) => {
			s.set(this.#_id, this);
			return s;
		});
		return this;
	}
	public flip(): this {
		switch (this.state._status) {
			case 'FACEUP':
				this.state._status = 'FACEDOWN';
				break;
			case 'FACEDOWN':
				this.state._status = 'FACEUP';
				break;
		}
		this.update((s) => s);
		return this;
	}
	public delete() {
		this.#_handStore.update((s) => {
			s.delete(this.#_id);
			return s;
		});
	}
	get status() {
		switch (this.state._status) {
			case 'FACEUP':
				return true;
			case 'FACEDOWN':
				return false;
		}
	}
	set status(n: boolean | PlayingCard['Status']) {
		switch (n) {
			case true:
				this.state._status = 'FACEUP';
				break;
			case 'FACEUP':
				this.state._status = 'FACEUP';
				break;
			case false:
				this.state._status = 'FACEDOWN';
				break;
			case 'FACEDOWN':
				this.state._status = 'FACEDOWN';
				break;
		}
	}
	update(cb: UpdateCallback) {
		this.#_handStore.update((s) => {
			cb(s, [this.#_id, this]);
			return s;
		});
	}
}
