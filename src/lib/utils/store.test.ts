import { get, writable } from 'svelte/store';
import { describe, expect, it } from 'vitest';

import { storeArrayToStore } from './store.js';

describe('storeArrayToStore', () => {
	it('combines the current values of all stores', () => {
		const combined = storeArrayToStore([writable(1), writable(2), writable(3)]);
		expect(get(combined)).toEqual([1, 2, 3]);
	});

	it('updates when a source store changes', () => {
		const source = writable('a');
		const combined = storeArrayToStore([source, writable('b')]);

		const seen: string[][] = [];
		const unsubscribe = combined.subscribe((v) => seen.push([...v]));
		source.set('c');
		unsubscribe();

		expect(get(combined)).toEqual(['c', 'b']);
		expect(seen).toContainEqual(['c', 'b']);
	});

	it('handles an empty store array', () => {
		expect(get(storeArrayToStore([]))).toEqual([]);
	});
});
