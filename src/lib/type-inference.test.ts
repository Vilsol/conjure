import type { StandardSchemaV1 } from '@standard-schema/spec';
import type { Component } from 'svelte';
import type { HTMLInputAttributes } from 'svelte/elements';
import { get } from 'svelte/store';
import { describe, expectTypeOf, it } from 'vitest';
import { z } from 'zod';

import type { InputElement } from './base-components/input.js';
import { fromValidatorToParams } from './base-components/input.js';
import type { MeterElement } from './base-components/meter.js';
import { FormGenerator } from './generator.js';
import type { ReMapper } from './instance.js';
import type { BaseProps, StripName } from './types.js';

const DummyInput = (() => undefined) as unknown as Component<BaseProps<InputElement>>;
const DummyMeter = (() => undefined) as unknown as Component<BaseProps<MeterElement>>;

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

	it('infers field types without an `as const` assertion', () => {
		const form = makeGenerator().newForm([
			{ type: 'input', name: 'email', schema: z.string() },
			{ type: 'input', name: 'age', schema: z.number() }
		]);

		const data = get(form.getData());
		expectTypeOf(data.email).toEqualTypeOf<string>();
		expectTypeOf(data.age).toEqualTypeOf<number>();
	});

	it('infers field types from any Standard Schema, not just zod', () => {
		const numberSchema: StandardSchemaV1<number, number> = {
			'~standard': {
				version: 1,
				vendor: 'custom',
				validate: (value) => (typeof value === 'number' ? { value } : { issues: [{ message: 'expected number' }] })
			}
		};

		const form = makeGenerator().newForm([{ type: 'input', name: 'score', schema: numberSchema }]);

		expectTypeOf(get(form.getData()).score).toEqualTypeOf<number>();
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

	it('accepts resolvable callbacks annotated with the inferred data type', () => {
		const fields = [
			{ type: 'input', name: 'email', schema: z.string() },
			{ type: 'input', name: 'age', schema: z.number() }
		] as const;
		type Data = ReMapper<typeof fields>;

		const form = makeGenerator()
			.withType<MeterElement>('meter', DummyMeter)
			.newForm([
				...fields,
				{
					type: 'meter',
					value: (data: Data) => {
						expectTypeOf(data.email).toEqualTypeOf<string>();
						expectTypeOf(data.age).toEqualTypeOf<number>();
						return data.age / 100;
					}
				}
			] as const);

		const data = get(form.getData());
		expectTypeOf(data.email).toEqualTypeOf<string>();
		expectTypeOf(data.age).toEqualTypeOf<number>();
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
