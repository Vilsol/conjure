import type { Component } from 'svelte';
import type { HTMLInputAttributes } from 'svelte/elements';
import { describe, expect, it } from 'vitest';

import type { InputElement } from './base-components/input.js';
import { fromValidatorToParams } from './base-components/input.js';
import { FormGenerator } from './generator.js';
import type { BaseProps, StripName } from './types.js';

const DummyInput = (() => undefined) as unknown as Component<BaseProps<InputElement>>;

describe('FormGenerator', () => {
	it('registers a type and retrieves its component', () => {
		const generator = new FormGenerator().withType<InputElement>('input', DummyInput);
		expect(generator.getComponent('input')).toBe(DummyInput);
	});

	it('returns undefined for unknown types', () => {
		const generator = new FormGenerator().withType<InputElement>('input', DummyInput);
		expect(generator.getComponent('missing' as never)).toBeUndefined();
	});

	it('is immutable: withType does not mutate the original generator', () => {
		const original = new FormGenerator();
		const extended = original.withType<InputElement>('input', DummyInput);
		expect(extended).not.toBe(original);
		expect(original.getComponent('input' as never)).toBeUndefined();
	});

	it('stores and retrieves default params per type', () => {
		const generator = new FormGenerator()
			.withType<InputElement>('input', DummyInput)
			.withDefaultParam('input', 'placeholder', 'Enter text');
		expect(generator.getDefaultParams('input')).toEqual({ placeholder: 'Enter text' });
	});

	it('is immutable: withDefaultParam does not mutate the original generator', () => {
		const base = new FormGenerator().withType<InputElement>('input', DummyInput);
		const withDefaults = base.withDefaultParam('input', 'placeholder', 'X');
		expect(base.getDefaultParams('input')).toEqual({});
		expect(withDefaults.getDefaultParams('input')).toEqual({ placeholder: 'X' });
	});

	it('does not leak default params between derived generators', () => {
		const first = new FormGenerator().withType<InputElement>('input', DummyInput).withDefaultParam('input', 'a', '1');
		first.withDefaultParam('input', 'b', '2');
		expect(first.getDefaultParams('input')).toEqual({ a: '1' });
	});

	it('returns an empty object for types without default params', () => {
		const generator = new FormGenerator().withType<InputElement>('input', DummyInput);
		expect(generator.getDefaultParams('input')).toEqual({});
	});

	it('retrieves the registered fromValidator converter', () => {
		const generator = new FormGenerator().withType<InputElement, StripName<HTMLInputAttributes>>(
			'input',
			DummyInput,
			fromValidatorToParams
		);
		expect(generator.getFromValidator('input')).toBe(fromValidatorToParams);
	});
});
