import type { StandardSchemaV1 } from '@standard-schema/spec';
import type { Component } from 'svelte';
import type { HTMLInputAttributes } from 'svelte/elements';
import { get, readable, writable } from 'svelte/store';
import * as v from 'valibot';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import type { InputElement } from './base-components/input.js';
import { fromValidatorToParams } from './base-components/input.js';
import { FormGenerator } from './generator.js';
import type { BaseProps, Resolvable, StripName } from './types.js';

const DummyInput = (() => undefined) as unknown as Component<BaseProps<InputElement>>;

const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

const makeGenerator = () =>
	new FormGenerator().withType<InputElement, StripName<HTMLInputAttributes>>(
		'input',
		DummyInput,
		fromValidatorToParams
	);

describe('FormInstance', () => {
	describe('resolveParams', () => {
		it('starts from the default params of the type', () => {
			const form = makeGenerator()
				.withDefaultParam('input', 'placeholder', 'Enter')
				.newForm([{ type: 'input', name: 'a', schema: z.string() }]);

			const params = form.resolveParams({ type: 'input', name: 'a' });
			expect(get(params)).toEqual({ placeholder: 'Enter' });
		});

		it('derives params from the element schema through the validator converter', () => {
			const form = makeGenerator().newForm([{ type: 'input', name: 'a', schema: z.string() }]);

			const params = form.resolveParams({
				type: 'input',
				name: 'a',
				schema: z.string().min(2).max(4)
			});
			expect(get(params)).toEqual({ minlength: 2, maxlength: 4 });
		});

		it('merges static object params over the base', async () => {
			const form = makeGenerator()
				.withDefaultParam('input', 'placeholder', 'Enter')
				.newForm([{ type: 'input', name: 'a', schema: z.string() }]);

			const params = form.resolveParams({
				type: 'input',
				name: 'a',
				params: { class: 'red' }
			});
			await tick();
			expect(get(params)).toEqual({ placeholder: 'Enter', class: 'red' });
		});

		it('merges promised params over the base', async () => {
			const form = makeGenerator()
				.withDefaultParam('input', 'placeholder', 'Enter')
				.newForm([{ type: 'input', name: 'a', schema: z.string() }]);

			const params = form.resolveParams({
				type: 'input',
				name: 'a',
				params: Promise.resolve({ class: 'blue' })
			});
			await tick();
			expect(get(params)).toEqual({ placeholder: 'Enter', class: 'blue' });
		});

		it('resolves function params against form data', async () => {
			const form = makeGenerator().newForm([{ type: 'input', name: 'a', schema: z.string() }]);

			const params = form.resolveParams({
				type: 'input',
				name: 'a',
				params: (data) => ({ class: data.a ? 'filled' : 'empty' })
			});
			const unsubscribe = params.subscribe(() => undefined);
			await tick();
			expect(get(params)).toEqual({ class: 'empty' });

			form.getData().set({ a: 'value' });
			await tick();
			expect(get(params)).toEqual({ class: 'filled' });
			unsubscribe();
		});

		it('merges store params over the base', async () => {
			const form = makeGenerator()
				.withDefaultParam('input', 'placeholder', 'Enter')
				.newForm([{ type: 'input', name: 'a', schema: z.string() }]);

			const params = form.resolveParams({
				type: 'input',
				name: 'a',
				params: readable({ class: 'green' })
			});
			const unsubscribe = params.subscribe(() => undefined);
			await tick();
			expect(get(params)).toEqual({ placeholder: 'Enter', class: 'green' });
			unsubscribe();
		});

		it('ignores stale async param resolutions (latest wins)', async () => {
			const form = makeGenerator().newForm([{ type: 'input', name: 'a', schema: z.string() }]);

			const resolvers: ((params: { class: string }) => void)[] = [];
			const params = form.resolveParams({
				type: 'input',
				name: 'a',
				params: () => new Promise<{ class: string }>((resolve) => resolvers.push(resolve))
			});
			const unsubscribe = params.subscribe(() => undefined);
			form.getData().set({ a: 'x' });
			await tick();
			expect(resolvers).toHaveLength(2);

			resolvers[1]({ class: 'second' });
			await tick();
			resolvers[0]({ class: 'first' });
			await tick();

			expect(get(params)).toEqual({ class: 'second' });
			unsubscribe();
		});
	});

	describe('resolveField', () => {
		it('resolves a plain value', async () => {
			const form = makeGenerator().newForm([{ type: 'input', name: 'a', schema: z.string() }]);
			const field = form.resolveField(5);
			await tick();
			expect(get(field)).toBe(5);
		});

		it('resolves a promised value', async () => {
			const form = makeGenerator().newForm([{ type: 'input', name: 'a', schema: z.string() }]);
			const field = form.resolveField(Promise.resolve('hello'));
			await tick();
			expect(get(field)).toBe('hello');
		});

		it('resolves a function of form data and tracks changes', async () => {
			const form = makeGenerator().newForm([{ type: 'input', name: 'a', schema: z.string() }]);
			const field = form.resolveField((data) => !!data.a);
			const unsubscribe = field.subscribe(() => undefined);
			await tick();
			expect(get(field)).toBe(false);

			form.getData().set({ a: 'x' });
			await tick();
			expect(get(field)).toBe(true);
			unsubscribe();
		});

		it('passes stores through', () => {
			const form = makeGenerator().newForm([{ type: 'input', name: 'a', schema: z.string() }]);
			const source = writable(42);
			const field = form.resolveField(source);
			expect(get(field)).toBe(42);
			source.set(43);
			expect(get(field)).toBe(43);
		});

		it('stops resolving function fields after unsubscribe', async () => {
			const form = makeGenerator().newForm([{ type: 'input', name: 'a', schema: z.string() }]);
			let calls = 0;
			const field = form.resolveField(() => {
				calls++;
				return true;
			});
			const unsubscribe = field.subscribe(() => undefined);
			await tick();
			unsubscribe();

			const before = calls;
			form.getData().set({ a: 'y' });
			await tick();
			expect(calls).toBe(before);
		});

		it('resolves a null value without throwing', async () => {
			const form = makeGenerator().newForm([{ type: 'input', name: 'a', schema: z.string() }]);
			const field = form.resolveField(null as Resolvable<null>);
			await tick();
			expect(get(field)).toBeNull();
		});

		it('ignores stale async field resolutions (latest wins)', async () => {
			const form = makeGenerator().newForm([{ type: 'input', name: 'a', schema: z.string() }]);

			const resolvers: ((value: string) => void)[] = [];
			const field = form.resolveField(() => new Promise<string>((resolve) => resolvers.push(resolve)));
			const unsubscribe = field.subscribe(() => undefined);
			form.getData().set({ a: 'x' });
			await tick();
			expect(resolvers).toHaveLength(2);

			resolvers[1]('second');
			await tick();
			resolvers[0]('first');
			await tick();

			expect(get(field)).toBe('second');
			unsubscribe();
		});
	});

	describe('validation', () => {
		it('validates named element values against their schemas', () => {
			const form = makeGenerator().newForm([
				{ type: 'input', name: 'name', schema: z.string().min(1) },
				{ type: 'input', name: 'age', schema: z.number() }
			]);

			form.getData().set({ name: 'a', age: 3 });
			expect(form.validate()).toBe(true);

			form.getData().set({ name: '', age: 3 });
			expect(form.validate()).toBe(false);
		});

		it('validates against a non-zod Standard Schema', () => {
			const evenSchema: StandardSchemaV1<number, number> = {
				'~standard': {
					version: 1,
					vendor: 'custom',
					validate: (value) =>
						typeof value === 'number' && value % 2 === 0 ? { value } : { issues: [{ message: 'must be even' }] }
				}
			};

			const form = makeGenerator().newForm([{ type: 'input', name: 'n', schema: evenSchema }]);

			form.getData().set({ n: 2 });
			expect(form.validate()).toBe(true);

			form.getData().set({ n: 3 });
			expect(form.validate()).toBe(false);
		});
	});

	describe('standard schema validators', () => {
		it('validates against a valibot schema', () => {
			const form = makeGenerator().newForm([{ type: 'input', name: 'email', schema: v.pipe(v.string(), v.email()) }]);

			form.getData().set({ email: 'not-an-email' });
			expect(form.validate()).toBe(false);

			form.getData().set({ email: 'test@example.com' });
			expect(form.validate()).toBe(true);
		});

		it('resolves asynchronous schema validation while subscribed', async () => {
			const asyncEven: StandardSchemaV1<number, number> = {
				'~standard': {
					version: 1,
					vendor: 'custom',
					validate: (value) =>
						Promise.resolve(
							typeof value === 'number' && value % 2 === 0 ? { value } : { issues: [{ message: 'must be even' }] }
						)
				}
			};

			const form = makeGenerator().newForm([{ type: 'input', name: 'n', schema: asyncEven }]);
			// Validation is a lazy derived store: async results only land while
			// something is subscribed (the Form component always is).
			const unsubscribe = form.isValid().subscribe(() => {});

			form.getData().set({ n: 3 });
			expect(form.validate()).toBe(true);
			await tick();
			expect(form.validate()).toBe(false);

			form.getData().set({ n: 4 });
			await tick();
			expect(form.validate()).toBe(true);

			unsubscribe();
		});
	});

	describe('duplicate name validation', () => {
		it('throws when two elements share a name', () => {
			expect(() =>
				makeGenerator().newForm([
					{ type: 'input', name: 'email', schema: z.string() },
					{ type: 'input', name: 'email', schema: z.string() }
				])
			).toThrow('Duplicate element name: "email"');
		});

		it('throws for duplicates nested in an object element', () => {
			expect(() =>
				makeGenerator().newForm([
					{
						type: 'object',
						name: 'address',
						schema: z.object({ street: z.string() }),
						elements: [
							{ type: 'input', name: 'street', schema: z.string() },
							{ type: 'input', name: 'street', schema: z.string() }
						]
					}
				])
			).toThrow('Duplicate element name: "address.street"');
		});

		it('allows radio inputs to share a name', () => {
			expect(() =>
				makeGenerator().newForm([
					{ type: 'input', name: 'color', schema: z.string(), params: { type: 'radio', value: 'red' } },
					{ type: 'input', name: 'color', schema: z.string(), params: { type: 'radio', value: 'blue' } }
				])
			).not.toThrow();
		});

		it('rejects a non-radio element reusing a radio group name', () => {
			expect(() =>
				makeGenerator().newForm([
					{ type: 'input', name: 'color', schema: z.string(), params: { type: 'radio', value: 'red' } },
					{ type: 'input', name: 'color', schema: z.string() }
				])
			).toThrow('Duplicate element name: "color"');
		});

		it('allows the same leaf name under different objects', () => {
			expect(() =>
				makeGenerator().newForm([
					{
						type: 'object',
						name: 'home',
						schema: z.object({ street: z.string() }),
						elements: [{ type: 'input', name: 'street', schema: z.string() }]
					},
					{
						type: 'object',
						name: 'work',
						schema: z.object({ street: z.string() }),
						elements: [{ type: 'input', name: 'street', schema: z.string() }]
					}
				])
			).not.toThrow();
		});
	});
});
