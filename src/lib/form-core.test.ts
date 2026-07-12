import { flushSync, mount, unmount } from 'svelte';
import { get } from 'svelte/store';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import Form from './Form.svelte';
import { Base } from './base.js';

const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

let cleanup: (() => void) | undefined;

const mountForm = async (elements: never, options?: never, generator = Base) => {
	const target = document.createElement('div');
	document.body.appendChild(target);
	const form = generator.newForm(elements, options);
	const app = mount(Form, { target, props: { form } });
	cleanup = () => {
		void unmount(app);
		target.remove();
	};
	flushSync();
	await tick();
	flushSync();
	return { target, form };
};

const setInput = async (input: HTMLInputElement, value: string) => {
	input.value = value;
	input.dispatchEvent(new Event('input', { bubbles: true }));
	await tick();
	flushSync();
};

afterEach(async () => {
	await tick();
	cleanup?.();
	cleanup = undefined;
});

describe('input coercion', () => {
	it('coerces checkbox inputs to booleans', async () => {
		const { target, form } = await mountForm([
			{ type: 'input', name: 'agree', schema: z.boolean(), params: { type: 'checkbox' } }
		] as never);

		const input = target.querySelector('input')!;
		input.checked = true;
		input.dispatchEvent(new Event('input', { bubbles: true }));
		input.dispatchEvent(new Event('change', { bubbles: true }));
		await tick();
		flushSync();

		expect(get(form.getData())).toMatchObject({ agree: true });
	});

	it('coerces number inputs to numbers', async () => {
		const { target, form } = await mountForm([
			{ type: 'input', name: 'age', schema: z.number(), params: { type: 'number' } }
		] as never);

		await setInput(target.querySelector('input')!, '42');

		expect(get(form.getData())).toMatchObject({ age: 42 });
	});

	it('writes nested paths for object fields', async () => {
		const { target, form } = await mountForm([
			{
				type: 'object',
				name: 'address',
				schema: z.object({ street: z.string() }),
				elements: [{ type: 'input', name: 'street', schema: z.string() }]
			}
		] as never);

		await setInput(target.querySelector('input')!, 'Main St');

		expect(get(form.getData())).toMatchObject({ address: { street: 'Main St' } });
	});
});

describe('validation display', () => {
	it('shows a validation message once an invalid field is touched', async () => {
		const { target } = await mountForm([
			{ type: 'input', name: 'email', label: 'Email', schema: z.string().min(5) }
		] as never);

		await setInput(target.querySelector('input')!, 'abc');

		const message = target.querySelector('.conjure-error');
		expect(message?.textContent).toBeTruthy();
	});

	it('clears the validation message when the field becomes valid', async () => {
		const { target } = await mountForm([
			{ type: 'input', name: 'email', label: 'Email', schema: z.string().min(5) }
		] as never);

		const input = target.querySelector('input')!;
		await setInput(input, 'abc');
		await setInput(input, 'abcdef');

		const messages = [...target.querySelectorAll('.conjure-error')].map((s) => s.textContent).join('');
		expect(messages).toBe('');
	});

	it('does not show validation messages for untouched fields', async () => {
		const { target } = await mountForm([
			{ type: 'input', name: 'email', schema: z.string().min(5) },
			{ type: 'input', name: 'other', schema: z.string().min(5) }
		] as never);

		const [first] = target.querySelectorAll('input');
		await setInput(first, 'abc');

		const spans = [...target.querySelectorAll('.conjure-error')];
		const nonEmpty = spans.filter((s) => (s.textContent ?? '') !== '');
		expect(nonEmpty).toHaveLength(1);
	});
});

describe('submit handling', () => {
	it('calls onSubmit with the form data when valid', async () => {
		const onSubmit = vi.fn();
		const { target } = await mountForm(
			[{ type: 'input', name: 'email', schema: z.string().min(3) }] as never,
			{ onSubmit } as never
		);

		await setInput(target.querySelector('input')!, 'hello');
		target.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true }));
		await tick();

		expect(onSubmit).toHaveBeenCalledTimes(1);
		expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ email: 'hello' }));
	});

	it('does not call onSubmit when validation fails', async () => {
		const onSubmit = vi.fn();
		const { target } = await mountForm(
			[{ type: 'input', name: 'email', schema: z.string().min(3) }] as never,
			{ onSubmit } as never
		);

		await setInput(target.querySelector('input')!, 'x');
		target.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true }));
		await tick();

		expect(onSubmit).not.toHaveBeenCalled();
	});

	it('shows all validation messages after a failed submit', async () => {
		const onSubmit = vi.fn();
		const { target } = await mountForm(
			[
				{ type: 'input', name: 'email', schema: z.string().min(3) },
				{ type: 'input', name: 'name', schema: z.string().min(3) }
			] as never,
			{ onSubmit } as never
		);

		target.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true }));
		await tick();
		flushSync();

		const nonEmpty = [...target.querySelectorAll('.conjure-error')].filter((s) => (s.textContent ?? '') !== '');
		expect(nonEmpty).toHaveLength(2);
	});
});

describe('initial values', () => {
	it('seeds the data store from element values', () => {
		const form = Base.newForm([
			{ type: 'input', name: 'email', schema: z.string(), value: 'preset@example.com' }
		] as never);

		expect(get(form.getData())).toMatchObject({ email: 'preset@example.com' });
	});

	it('seeds the data store from zod defaults', () => {
		const form = Base.newForm([{ type: 'input', name: 'name', schema: z.string().default('anon') }] as never);

		expect(get(form.getData())).toMatchObject({ name: 'anon' });
	});

	it('prefers the element value over the zod default', () => {
		const form = Base.newForm([
			{ type: 'input', name: 'name', schema: z.string().default('anon'), value: 'explicit' }
		] as never);

		expect(get(form.getData())).toMatchObject({ name: 'explicit' });
	});

	it('seeds nested object element values under dot paths', () => {
		const form = Base.newForm([
			{
				type: 'object',
				name: 'address',
				schema: z.object({ street: z.string() }),
				elements: [{ type: 'input', name: 'street', schema: z.string(), value: 'Main St' }]
			}
		] as never);

		expect(get(form.getData())).toMatchObject({ address: { street: 'Main St' } });
	});

	it('renders seeded values into inputs on mount', async () => {
		const { target } = await mountForm([
			{ type: 'input', name: 'email', schema: z.string(), value: 'preset@example.com' }
		] as never);

		expect(target.querySelector('input')!.value).toBe('preset@example.com');
	});

	it('does not show validation messages for seeded fields', async () => {
		const { target } = await mountForm([
			{ type: 'input', name: 'email', schema: z.string().min(20), value: 'short' }
		] as never);

		const nonEmpty = [...target.querySelectorAll('.conjure-error')].filter((s) => (s.textContent ?? '') !== '');
		expect(nonEmpty).toHaveLength(0);
	});
});

describe('initial data', () => {
	it('seeds the data store from a provided data object', () => {
		const form = Base.newForm([{ type: 'input', name: 'email', schema: z.string() }] as never, {
			data: { email: 'stored@example.com' }
		});

		expect(get(form.getData())).toMatchObject({ email: 'stored@example.com' });
	});

	it('prefers provided data over element values and zod defaults', () => {
		const form = Base.newForm(
			[{ type: 'input', name: 'name', schema: z.string().default('anon'), value: 'explicit' }] as never,
			{ data: { name: 'stored' } }
		);

		expect(get(form.getData())).toMatchObject({ name: 'stored' });
	});

	it('fills fields missing from the provided data with defaults', () => {
		const form = Base.newForm(
			[
				{ type: 'input', name: 'email', schema: z.string() },
				{ type: 'input', name: 'role', schema: z.string().default('member') }
			] as never,
			{ data: { email: 'stored@example.com' } }
		);

		expect(get(form.getData())).toMatchObject({ email: 'stored@example.com', role: 'member' });
	});

	it('merges nested objects with defaults', () => {
		const form = Base.newForm(
			[
				{
					type: 'object',
					name: 'address',
					schema: z.object({ street: z.string(), country: z.string() }),
					elements: [
						{ type: 'input', name: 'street', schema: z.string() },
						{ type: 'input', name: 'country', schema: z.string().default('LV') }
					]
				}
			] as never,
			{ data: { address: { street: 'Main St' } } }
		);

		expect(get(form.getData())).toMatchObject({ address: { street: 'Main St', country: 'LV' } });
	});

	it('does not mutate the provided data object', async () => {
		const data = { email: 'stored@example.com' };
		const { target, form } = await mountForm(
			[{ type: 'input', name: 'email', schema: z.string() }] as never,
			{ data } as never
		);

		await setInput(target.querySelector('input')!, 'changed@example.com');

		expect(get(form.getData())).toMatchObject({ email: 'changed@example.com' });
		expect(data.email).toBe('stored@example.com');
	});

	it('renders provided data into inputs without marking fields touched', async () => {
		const { target, form } = await mountForm(
			[{ type: 'input', name: 'email', schema: z.string().min(20) }] as never,
			{
				data: { email: 'stored@example.com' }
			} as never
		);

		expect(target.querySelector('input')!.value).toBe('stored@example.com');
		expect(get(form.getTouched())).toEqual({});
		const nonEmpty = [...target.querySelectorAll('.conjure-error')].filter((s) => (s.textContent ?? '') !== '');
		expect(nonEmpty).toHaveLength(0);
	});
});

describe('select object values', () => {
	const colors = [
		{ label: 'Red', value: { id: 1, hex: '#f00' } },
		{ label: 'Blue', value: { id: 2, hex: '#00f' } }
	];

	it('puts the original option object into form data when selected', async () => {
		const { target, form } = await mountForm([
			{ type: 'select', name: 'color', schema: z.object({ id: z.number(), hex: z.string() }), options: colors }
		] as never);

		const select = target.querySelector('select')!;
		select.options[1].selected = true;
		select.dispatchEvent(new Event('change', { bubbles: true }));
		await tick();

		expect(get(form.getData())).toMatchObject({ color: { id: 2, hex: '#00f' } });
	});

	it('still resolves string option values to the string itself', async () => {
		const { target, form } = await mountForm([
			{
				type: 'select',
				name: 'size',
				schema: z.string(),
				options: [
					{ label: 'Small', value: 's' },
					{ label: 'Large', value: 'l' }
				]
			}
		] as never);

		const select = target.querySelector('select')!;
		select.options[1].selected = true;
		select.dispatchEvent(new Event('change', { bubbles: true }));
		await tick();

		expect(get(form.getData())).toMatchObject({ size: 'l' });
	});

	it('selects the matching option for provided edit data', async () => {
		const { target } = await mountForm(
			[
				{
					type: 'select',
					name: 'color',
					schema: z.object({ id: z.number(), hex: z.string() }),
					options: colors
				}
			] as never,
			{ data: { color: { id: 2, hex: '#00f' } } } as never
		);

		const select = target.querySelector('select')!;
		expect(select.selectedIndex).toBe(1);
	});

	it('resolves multiple selections to an array of option objects', async () => {
		const { target, form } = await mountForm([
			{
				type: 'select',
				name: 'colors',
				schema: z.array(z.object({ id: z.number(), hex: z.string() })),
				options: colors,
				params: { multiple: true }
			}
		] as never);

		const select = target.querySelector('select')!;
		select.options[0].selected = true;
		select.options[1].selected = true;
		select.dispatchEvent(new Event('change', { bubbles: true }));
		await tick();

		expect(get(form.getData())).toMatchObject({
			colors: [
				{ id: 1, hex: '#f00' },
				{ id: 2, hex: '#00f' }
			]
		});
	});
});

describe('touched store', () => {
	it('starts with no touched fields', () => {
		const form = Base.newForm([{ type: 'input', name: 'email', schema: z.string() }] as never);

		expect(get(form.getTouched())).toEqual({});
	});

	it('marks a field touched after user input', async () => {
		const { target, form } = await mountForm([{ type: 'input', name: 'email', schema: z.string() }] as never);

		await setInput(target.querySelector('input')!, 'abc');

		expect(get(form.getTouched())).toMatchObject({ email: true });
	});
});

describe('isValid store', () => {
	it('reports invalid while required fields are missing', () => {
		const form = Base.newForm([{ type: 'input', name: 'email', schema: z.string().min(3) }] as never);

		expect(get(form.isValid())).toBe(false);
	});

	it('reports valid when seeded defaults satisfy the schema', () => {
		const form = Base.newForm([{ type: 'input', name: 'email', schema: z.string().min(3).default('hello') }] as never);

		expect(get(form.isValid())).toBe(true);
	});

	it('updates reactively as the user types', async () => {
		const { target, form } = await mountForm([{ type: 'input', name: 'email', schema: z.string().min(3) }] as never);

		const seen: boolean[] = [];
		const unsubscribe = form.isValid().subscribe((valid: boolean) => seen.push(valid));

		await setInput(target.querySelector('input')!, 'hello');

		unsubscribe();
		expect(seen[0]).toBe(false);
		expect(seen.at(-1)).toBe(true);
	});
});

describe('programmatic data updates', () => {
	it('updates input values when data is set programmatically', async () => {
		const { target, form } = await mountForm([{ type: 'input', name: 'email', schema: z.string() }] as never);

		form.getData().set({ email: 'preset@example.com' });
		await tick();
		flushSync();

		expect(target.querySelector('input')!.value).toBe('preset@example.com');
	});

	it('updates checkbox state when data is set programmatically', async () => {
		const { target, form } = await mountForm([
			{ type: 'input', name: 'agree', schema: z.boolean(), params: { type: 'checkbox' } }
		] as never);

		form.getData().set({ agree: true });
		await tick();
		flushSync();

		expect(target.querySelector('input')!.checked).toBe(true);
	});

	it('updates validation errors when data is set programmatically', async () => {
		const { target, form } = await mountForm([{ type: 'input', name: 'email', schema: z.string().min(5) }] as never);

		await setInput(target.querySelector('input')!, 'valid input');
		form.getData().set({ email: 'x' });
		await tick();
		flushSync();

		expect(target.querySelector('.conjure-error')!.textContent).toBeTruthy();
	});
});

describe('common component params', () => {
	it('renders generator wrapper and label params on built-in elements', async () => {
		const generator = Base.withCommonParam('wrapper', 'class', 'my-row').withCommonParam('label', 'data-test', 'lbl');
		const { target } = await mountForm(
			[{ type: 'input', name: 'email', label: 'Email', schema: z.string() }] as never,
			undefined,
			generator
		);

		expect(target.querySelector('div.my-row')).toBeTruthy();
		expect(target.querySelector('span[data-test="lbl"]')).toBeTruthy();
	});

	it('does not leak params to forms from other generators', async () => {
		const custom = Base.withCommonParam('wrapper', 'class', 'my-row');
		await mountForm([{ type: 'input', name: 'a', schema: z.string() }] as never, undefined, custom);
		const firstCleanup = cleanup;

		const { target } = await mountForm([{ type: 'input', name: 'b', schema: z.string() }] as never);

		expect(target.querySelector('div.conjure-wrapper')).toBeTruthy();
		expect(target.querySelector('div.my-row')).toBeFalsy();

		firstCleanup?.();
	});
});
