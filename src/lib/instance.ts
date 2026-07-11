import type { Readable, Writable } from 'svelte/store';
import { derived, get, writable } from 'svelte/store';
import type { ZodObject, ZodTypeAny } from 'zod';
import * as zod from 'zod';
import { ZodDefault } from 'zod';

import type { FormGenerator } from './generator.js';
import type { ArrayElement, BaseElement, ObjectElement, Resolvable } from './types.js';
import { getPath, setPath } from './utils/path.js';
import { fromZod } from './validators/index.js';

// TODO Replace unknown with calculated value somehow E[number]['value']
// TODO Figure out why this falls back to unknown with more than one element

type SubRemap<T> =
	T extends ObjectElement<BaseElement<string>>
		? ReMapper<T['elements']>
		: T extends ArrayElement<BaseElement<string>>
			? T['element'] extends Omit<ObjectElement<BaseElement<string>>, 'name'>
				? ReMapper<T['element']['elements']>[]
				: unknown[]
			: unknown;

export type ReMapper<E extends Readonly<BaseElement<string>[]>> = {
	[key in Extract<E[number], { name: string }> as key['name']]: E[number] extends { name: string }
		? SubRemap<E[number]>
		: never;
};

export interface FormOptions<D> {
	onSubmit?: (data: D) => void;
}

type NamedControl = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

const coerceValue = (el: NamedControl): unknown => {
	if (el instanceof HTMLInputElement) {
		if (el.type === 'checkbox') {
			return el.checked;
		}
		if (el.type === 'number' || el.type === 'range') {
			return el.value === '' ? undefined : el.valueAsNumber;
		}
		return el.value;
	}
	if (el instanceof HTMLSelectElement && el.multiple) {
		return [...el.selectedOptions].map((option) => option.value);
	}
	return el.value;
};

const syncControls = (node: HTMLFormElement, data: unknown) => {
	const controls = node.querySelectorAll<NamedControl>('input[name], textarea[name], select[name]');
	for (const el of controls) {
		const value = getPath(data, el.name);
		if (el instanceof HTMLInputElement && el.type === 'checkbox') {
			const next = !!value;
			if (el.checked !== next) {
				el.checked = next;
			}
		} else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
			const next = String(value);
			if (el.value !== next) {
				el.value = next;
			}
		} else if (value === undefined || value === null) {
			if (el.value !== '') {
				el.value = '';
			}
		}
	}
};

const initialValue = (element: BaseElement<string>): unknown => {
	if ('value' in element && element.value !== undefined) {
		return element.value;
	}
	if ('schema' in element && element.schema instanceof ZodDefault) {
		return (element.schema as ZodTypeAny).parse(undefined);
	}
	return undefined;
};

const seedDefaults = (elements: Readonly<BaseElement<string>[]>, data: Record<string, unknown>, prefix = '') => {
	for (const element of elements) {
		if (!('name' in element) || typeof element.name !== 'string') {
			continue;
		}
		if (element.type === 'object' && 'elements' in element) {
			seedDefaults((element as ObjectElement<BaseElement<string>>).elements, data, prefix + element.name + '.');
			continue;
		}
		if (!('schema' in element)) {
			continue;
		}
		const value = initialValue(element);
		if (value !== undefined) {
			setPath(data, prefix + element.name, value);
		}
	}
};

export class FormInstance<T extends FormGenerator<BaseElement<string>>, E extends Readonly<BaseElement<string>[]>> {
	private readonly data: Writable<ReMapper<E>>;
	private readonly allErrors = writable<Record<string, string[]>>({});
	private readonly touched = writable<Record<string, boolean>>({});

	constructor(
		public generator: T,
		public elements: E,
		private options: FormOptions<ReMapper<E>> = {}
	) {
		const seed: Record<string, unknown> = {};
		seedDefaults(elements, seed);
		this.data = writable(seed as ReMapper<E>);
	}

	/**
	 * Create the form action to apply on a `<form>` element with `use:`.
	 *
	 * Any form control with a `name` attribute participates: its value is
	 * written into the data store under the dot-separated path of its name,
	 * and programmatic data changes are written back into the DOM.
	 */
	createForm() {
		return (node: HTMLFormElement) => {
			const handleInput = (event: Event) => {
				const el = event.target as NamedControl | null;
				if (!el || !el.name) {
					return;
				}
				this.data.update((data) => setPath(data, el.name, coerceValue(el)));
				this.touched.update((touched) => ({ ...touched, [el.name]: true }));
				this.validate();
			};

			const handleSubmit = (event: Event) => {
				event.preventDefault();
				this.touched.update((touched) => ({ ...touched, '*': true }));
				if (this.validate()) {
					this.options.onSubmit?.(get(this.data));
				}
			};

			const unsubscribe = this.data.subscribe((data) => {
				syncControls(node, data);
			});

			node.addEventListener('input', handleInput);
			node.addEventListener('change', handleInput);
			node.addEventListener('submit', handleSubmit);

			return {
				destroy: () => {
					unsubscribe();
					node.removeEventListener('input', handleInput);
					node.removeEventListener('change', handleInput);
					node.removeEventListener('submit', handleSubmit);
				}
			};
		};
	}

	getData(): Writable<ReMapper<E>> {
		return this.data;
	}

	/**
	 * Fields the user has interacted with, keyed by field path. After a
	 * submit attempt the `'*'` key marks every field as touched.
	 */
	getTouched(): Readable<Record<string, boolean>> {
		return this.touched;
	}

	/**
	 * Whether the current data satisfies the composed schema, re-evaluated
	 * on every data change.
	 */
	isValid(): Readable<boolean> {
		const schema = this.getValidationSchema();
		return derived(this.data, ($data) => schema.safeParse($data).success);
	}

	/**
	 * Validation errors keyed by field path, filtered to touched fields
	 * (all fields count as touched after a submit attempt).
	 */
	getErrors(): Readable<Record<string, string[]>> {
		return derived([this.allErrors, this.touched], ([$errors, $touched]) => {
			if ($touched['*']) {
				return $errors;
			}
			return Object.fromEntries(Object.entries($errors).filter(([key]) => $touched[key]));
		});
	}

	/**
	 * Validate the current data against the composed schema, updating the
	 * error store. Returns whether the data is valid.
	 */
	validate(): boolean {
		const result = this.getValidationSchema().safeParse(get(this.data));
		if (result.success) {
			this.allErrors.set({});
			return true;
		}

		const errors: Record<string, string[]> = {};
		for (const issue of result.error.issues) {
			const key = issue.path.join('.');
			(errors[key] ??= []).push(issue.message);
		}
		this.allErrors.set(errors);
		return false;
	}

	// TODO Figure out how to return actual params not map of strings
	resolveParams<X extends { [key: string]: unknown }>(
		input: BaseElement<string> & { name?: string; params?: Resolvable<X>; schema?: ZodTypeAny }
	): Readable<{ [key: string]: string }> {
		let base = {
			...this.generator.getDefaultParams(input.type)
		};

		if (input.schema) {
			const fromValidator = this.generator.getFromValidator<X>(input.type);
			if (fromValidator) {
				// TODO Support various validators
				base = fromValidator(base as X, fromZod(input.schema)) as { [key: string]: string };
			}
		}

		if (input.params === undefined) {
			return writable(base);
		}

		const params = input.params;
		const merge = (resolved: X) => ({ ...base, ...resolved }) as { [key: string]: string };

		if (typeof params === 'function') {
			return derived(
				this.data,
				($data, set) => {
					void Promise.resolve(params($data as { [key: string]: unknown })).then((resolved) => {
						set(merge(resolved));
					});
				},
				base
			);
		}

		if (params !== null && typeof params === 'object' && 'subscribe' in params) {
			return derived(
				params as Readable<X>,
				($params, set) => {
					set(merge($params));
				},
				base
			);
		}

		const result = writable(base);
		void Promise.resolve(params).then((resolved) => {
			result.set(merge(resolved));
		});
		return result;
	}

	resolveField<X>(field: Resolvable<X>): Readable<X> {
		if (typeof field === 'function') {
			return derived(this.data, ($data, set) => {
				const resolvable = (field as (data: { [key: string]: unknown }) => X | PromiseLike<X>)($data);
				void Promise.resolve(resolvable).then((resolved) => {
					set(resolved);
				});
			});
		}

		if (field !== null && typeof field === 'object' && 'subscribe' in field) {
			return field;
		}

		const result = writable<X>();
		void Promise.resolve(field).then((resolved) => {
			result.set(resolved);
		});
		return result;
	}

	// TODO Support various validators
	getValidationSchema(): ZodObject {
		return zod.object(
			this.elements.reduce<Record<string, ZodTypeAny>>((base, value) => {
				if ('schema' in value && 'name' in value) {
					base[value.name as string] = value.schema as ZodTypeAny;
				}
				return base;
			}, {})
		);
	}
}
