import type { Readable } from 'svelte/store';
import { derived, readable } from 'svelte/store';

export const storeArrayToStore = <T>(stores: Readable<T>[]): Readable<T[]> => {
	if (stores.length === 0) {
		return readable([]);
	}

	return derived(stores, (values) => [...values]);
};
