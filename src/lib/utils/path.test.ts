import { describe, expect, it } from 'vitest';

import { getPath, setPath } from './path.js';

describe('setPath', () => {
	it('sets a top-level value', () => {
		expect(setPath({}, 'email', 'x')).toEqual({ email: 'x' });
	});

	it('creates nested objects for dotted paths', () => {
		expect(setPath({}, 'address.street', 'Main')).toEqual({ address: { street: 'Main' } });
	});

	it('creates arrays for numeric segments', () => {
		const result = setPath({}, 'items.0', 'a');
		expect(result).toEqual({ items: ['a'] });
		expect(Array.isArray((result as { items: unknown }).items)).toBe(true);
	});

	it('sets nested objects inside arrays', () => {
		expect(setPath({}, 'items.1.name', 'a')).toEqual({ items: [undefined, { name: 'a' }] });
	});

	it('preserves existing sibling values', () => {
		const base = { address: { street: 'Main' }, email: 'x' };
		expect(setPath(base, 'address.city', 'Riga')).toEqual({
			address: { street: 'Main', city: 'Riga' },
			email: 'x'
		});
	});

	it('overwrites existing values', () => {
		expect(setPath({ email: 'a' }, 'email', 'b')).toEqual({ email: 'b' });
	});
});

describe('getPath', () => {
	it('reads a top-level value', () => {
		expect(getPath({ email: 'x' }, 'email')).toBe('x');
	});

	it('reads nested values', () => {
		expect(getPath({ address: { street: 'Main' } }, 'address.street')).toBe('Main');
	});

	it('reads array values', () => {
		expect(getPath({ items: ['a', 'b'] }, 'items.1')).toBe('b');
	});

	it('returns undefined for missing paths', () => {
		expect(getPath({}, 'a.b.c')).toBeUndefined();
	});
});
