import type { Component } from 'svelte';
import type { HTMLInputAttributes } from 'svelte/elements';
import { get } from 'svelte/store';
import { describe, expectTypeOf, it } from 'vitest';
import { z } from 'zod';

import type { InputElement } from './base-components/input.js';
import { fromValidatorToParams } from './base-components/input.js';
import { FormGenerator } from './generator.js';
import type { BaseProps, StripName } from './types.js';

const DummyInput = (() => undefined) as unknown as Component<BaseProps<InputElement>>;

const makeGenerator = () =>
	new FormGenerator().withType<InputElement, StripName<HTMLInputAttributes>>(
		'input',
		DummyInput,
		fromValidatorToParams
	);

describe('resolveParams type inference', () => {
	it('returns the params type declared on the element', () => {
		const form = makeGenerator().newForm([{ type: 'input', name: 'a', schema: z.string() }]);

		const element: InputElement = {
			type: 'input',
			name: 'a',
			schema: z.string(),
			params: { class: 'red' }
		};
		const params = form.resolveParams(element);

		expectTypeOf(get(params)).toEqualTypeOf<StripName<HTMLInputAttributes>>();
	});
});

describe('ReMapper type inference', () => {
	it('infers field types from zod schemas for multiple elements', () => {
		const form = makeGenerator().newForm([
			{ type: 'input', name: 'email', schema: z.string() },
			{ type: 'input', name: 'age', schema: z.number() }
		] as const);

		const data = get(form.getData());
		expectTypeOf(data.email).toEqualTypeOf<string>();
		expectTypeOf(data.age).toEqualTypeOf<number>();
	});

	it('infers nested object element fields', () => {
		const form = makeGenerator().newForm([
			{
				type: 'object',
				name: 'address',
				schema: z.object({ street: z.string() }),
				elements: [{ type: 'input', name: 'street', schema: z.string() }]
			}
		] as const);

		const data = get(form.getData());
		expectTypeOf(data.address).toEqualTypeOf<{ street: string }>();
	});

	it('accepts deeply partial edit data', () => {
		const form = makeGenerator().newForm(
			[
				{
					type: 'object',
					name: 'address',
					schema: z.object({ street: z.string(), country: z.string() }),
					elements: [
						{ type: 'input', name: 'street', schema: z.string() },
						{ type: 'input', name: 'country', schema: z.string() }
					]
				}
			] as const,
			{ data: { address: { street: 'Main St' } } }
		);

		expectTypeOf(get(form.getData()).address).toEqualTypeOf<{ street: string; country: string }>();
	});

	it('infers primitive array element types', () => {
		const form = makeGenerator().newForm([
			{
				type: 'array',
				name: 'tags',
				schema: z.array(z.string()),
				element: { type: 'input', schema: z.string() },
				count: 2
			}
		] as const);

		const data = get(form.getData());
		expectTypeOf(data.tags).toEqualTypeOf<string[]>();
	});
});
