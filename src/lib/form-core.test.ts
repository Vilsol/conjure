import { flushSync, mount, unmount } from 'svelte';
import { get } from 'svelte/store';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import Form from './Form.svelte';
import { Base } from './base.js';

const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

let cleanup: (() => void) | undefined;

const mountForm = async (elements: never, options?: never) => {
	const target = document.createElement('div');
	document.body.appendChild(target);
	const form = Base.newForm(elements, options);
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
});
