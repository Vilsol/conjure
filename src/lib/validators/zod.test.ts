import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { fromSchema } from './zod.js';

describe('fromSchema', () => {
	it('extracts min and max from a string schema', () => {
		expect(fromSchema(z.string().min(2).max(10))).toEqual({ min: 2, max: 10 });
	});

	it('extracts email type', () => {
		expect(fromSchema(z.string().email())).toEqual({ type: 'email' });
	});

	it('extracts url type', () => {
		expect(fromSchema(z.string().url())).toEqual({ type: 'url' });
	});

	it('extracts email type from the top-level format schema', () => {
		expect(fromSchema(z.email())).toEqual({ type: 'email' });
	});

	it('extracts url type from the top-level format schema', () => {
		expect(fromSchema(z.url())).toEqual({ type: 'url' });
	});

	it('extracts constraints from format schemas', () => {
		expect(fromSchema(z.email().min(5).max(50))).toEqual({ type: 'email', min: 5, max: 50 });
	});

	it('extracts number type with min and max', () => {
		expect(fromSchema(z.number().min(1).max(5))).toEqual({ type: 'number', min: 1, max: 5 });
	});

	it('preserves a zero minimum on numbers', () => {
		expect(fromSchema(z.number().min(0))).toEqual({ type: 'number', min: 0 });
	});

	it('returns an empty definition for unconstrained strings', () => {
		expect(fromSchema(z.string())).toEqual({});
	});

	it('unwraps optional schemas', () => {
		expect(fromSchema(z.string().min(3).optional())).toEqual({ min: 3 });
	});

	it('unwraps schemas with defaults', () => {
		expect(fromSchema(z.string().min(3).default('abc'))).toEqual({ min: 3 });
	});

	it('unwraps nullable schemas', () => {
		expect(fromSchema(z.number().max(9).nullable())).toEqual({ type: 'number', max: 9 });
	});

	it('unwraps nested wrappers', () => {
		expect(fromSchema(z.string().email().optional().default('a@b.c'))).toEqual({ type: 'email' });
	});
});
