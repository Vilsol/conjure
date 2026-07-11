import { flushSync, mount, unmount } from 'svelte';
import { get } from 'svelte/store';
import { afterEach, describe, expect, it } from 'vitest';
import { z } from 'zod';

import Form from './Form.svelte';
import { Base } from './base.js';

const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

let cleanup: (() => void) | undefined;

const mountForm = async (elements: never) => {
	const target = document.createElement('div');
	document.body.appendChild(target);
	const form = Base.newForm(elements);
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

afterEach(async () => {
	// let @felte/reporter-svelte's deferred setTimeout callbacks run before unmounting
	await tick();
	cleanup?.();
	cleanup = undefined;
});

describe('Form rendering', () => {
	it('renders top-level inputs without a leading dot in the name', async () => {
		const { target } = await mountForm([{ type: 'input', name: 'email', label: 'Email', schema: z.string() }] as never);

		const input = target.querySelector('input');
		expect(input?.getAttribute('name')).toBe('email');
	});

	it('prefixes input names inside nested objects', async () => {
		const { target } = await mountForm([
			{
				type: 'object',
				name: 'address',
				schema: z.object({ street: z.string() }),
				elements: [{ type: 'input', name: 'street', schema: z.string() }]
			}
		] as never);

		const input = target.querySelector('input');
		expect(input?.getAttribute('name')).toBe('address.street');
	});

	it('prefixes select names inside nested objects', async () => {
		const { target } = await mountForm([
			{
				type: 'object',
				name: 'prefs',
				schema: z.object({ color: z.string() }),
				elements: [
					{
						type: 'select',
						name: 'color',
						schema: z.string(),
						options: [{ label: 'Red', value: 'red' }]
					}
				]
			}
		] as never);

		const select = target.querySelector('select');
		expect(select?.getAttribute('name')).toBe('prefs.color');
	});

	it('prefixes textarea names inside nested objects', async () => {
		const { target } = await mountForm([
			{
				type: 'object',
				name: 'post',
				schema: z.object({ body: z.string() }),
				elements: [{ type: 'textarea', name: 'body', schema: z.string() }]
			}
		] as never);

		const textarea = target.querySelector('textarea');
		expect(textarea?.getAttribute('name')).toBe('post.body');
	});

	it('names array items by index without trailing separators', async () => {
		const { target } = await mountForm([
			{
				type: 'array',
				name: 'items',
				schema: z.array(z.string()),
				count: 2,
				element: { type: 'input', schema: z.string() }
			}
		] as never);

		const names = [...target.querySelectorAll('input')].map((i) => i.getAttribute('name'));
		expect(names).toEqual(['items.0', 'items.1']);
	});

	it('renders schema buttons with type button so they do not submit the form', async () => {
		const { target } = await mountForm([{ type: 'button', text: 'Click', click: () => undefined }] as never);

		const button = target.querySelector('button');
		expect(button?.getAttribute('type')).toBe('button');
	});

	it('associates labels with inputs', async () => {
		const { target } = await mountForm([{ type: 'input', name: 'email', label: 'Email', schema: z.string() }] as never);

		const label = target.querySelector('label');
		const input = target.querySelector('input');
		expect(label?.getAttribute('for')).toBeTruthy();
		expect(label?.getAttribute('for')).toBe(input?.getAttribute('id'));
	});

	it('does not render nested label elements', async () => {
		const { target } = await mountForm([{ type: 'input', name: 'email', label: 'Email', schema: z.string() }] as never);

		expect(target.querySelector('label label')).toBeNull();
	});

	it('does not render debug output inside selects', async () => {
		const { target } = await mountForm([
			{
				type: 'select',
				name: 'color',
				schema: z.string(),
				options: [{ label: 'Red', value: 'red' }]
			}
		] as never);

		expect(target.querySelector('pre')).toBeNull();
		expect(target.querySelectorAll('option')).toHaveLength(1);
	});

	it('renders headers at the requested level', async () => {
		const { target } = await mountForm([{ type: 'header', text: 'Title', size: 3 }] as never);
		expect(target.querySelector('h3')?.textContent).toBe('Title');
	});

	it('hides elements when their hide resolvable becomes true', async () => {
		const { target, form } = await mountForm([
			{ type: 'input', name: 'visible', schema: z.boolean() },
			{
				type: 'header',
				text: 'Conditional',
				hide: (data: { visible?: boolean }) => !!data.visible
			}
		] as never);

		expect(target.querySelector('h1')).not.toBeNull();

		(form.getData() as { set: (v: unknown) => void }).set({ visible: true });
		await tick();
		flushSync();
		expect(target.querySelector('h1')).toBeNull();
	});

	it('reflects form input in the data store', async () => {
		const { target, form } = await mountForm([{ type: 'input', name: 'email', schema: z.string() }] as never);

		const input = target.querySelector('input');
		expect(input).not.toBeNull();
		input!.value = 'a@b.c';
		input!.dispatchEvent(new Event('input', { bubbles: true }));
		await tick();
		flushSync();

		expect(get(form.getData())).toMatchObject({ email: 'a@b.c' });
	});
});
