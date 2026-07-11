import { describe, expect, it } from 'vitest';

import { fromValidatorToParams } from './input.js';

describe('fromValidatorToParams', () => {
	it('maps min and max to number input attributes', () => {
		expect(fromValidatorToParams({}, { type: 'number', min: 1, max: 5 })).toEqual({
			type: 'number',
			min: 1,
			max: 5
		});
	});

	it('maps min and max to minlength and maxlength for text inputs', () => {
		expect(fromValidatorToParams({}, { min: 2, max: 10 })).toEqual({
			minlength: 2,
			maxlength: 10
		});
	});

	it('keeps existing params', () => {
		expect(fromValidatorToParams({ placeholder: 'Name' }, { type: 'email' })).toEqual({
			placeholder: 'Name',
			type: 'email'
		});
	});

	it('does not override an explicit type with a validator without type', () => {
		expect(fromValidatorToParams({ type: 'password' }, { min: 8 })).toEqual({
			type: 'password',
			minlength: 8
		});
	});

	it('preserves a zero minimum', () => {
		expect(fromValidatorToParams({}, { type: 'number', min: 0 })).toEqual({
			type: 'number',
			min: 0
		});
	});

	it('preserves a zero minlength', () => {
		expect(fromValidatorToParams({}, { min: 0 })).toEqual({ minlength: 0 });
	});
});
