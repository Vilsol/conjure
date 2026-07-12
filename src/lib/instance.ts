import type { Readable, Writable } from 'svelte/store';
import { derived, get, writable } from 'svelte/store';
import type { ZodObject, ZodTypeAny } from 'zod';
import * as zod from 'zod';
import { ZodDefault } from 'zod';

import type { SelectOption } from './base-components/select.js';
import type { FormGenerator } from './generator.js';
import type { ArrayElement, BaseElement, ObjectElement, Resolvable } from './types.js';
import { getPath, setPath } from './utils/path.js';
import { storeArrayToStore } from './utils/store.js';
import { toText } from './utils/text.js';
import { fromZod } from './validators/index.js';

type SubRemap<T> =
	T extends ObjectElement<BaseElement<string>>
		? ReMapper<T['elements']>
		: T extends ArrayElement<BaseElement<string>>
			? T['element'] extends Omit<ObjectElement<BaseElement<string>>, 'name'>
				? ReMapper<T['element']['elements']>[]
				: T['element'] extends { schema: infer S extends ZodTypeAny }
					? zod.output<S>[]
					: unknown[]
			: T extends { schema: infer S extends ZodTypeAny }
				? zod.output<S>
				: unknown;

export type ReMapper<E extends Readonly<BaseElement<string>[]>> = {
	[K in Extract<E[number], { name: string }> as K['name']]: SubRemap<K>;
};

type DeepPartial<T> = T extends (infer U)[]
	? DeepPartial<U>[]
	: T extends object
		? { [K in keyof T]?: DeepPartial<T[K]> }
		: T;

export interface FormOptions<D> {
	/** Existing values to edit, merged over element/schema defaults. */
	data?: DeepPartial<D>;
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
		if (el.type === 'file') {
			return el.multiple ? [...(el.files ?? [])] : (el.files?.[0] ?? undefined);
		}
		return el.value;
	}
	if (el instanceof HTMLSelectElement && el.multiple) {
		return [...el.selectedOptions].map((option) => option.value);
	}
	return el.value;
};

type SelectOptionsMap = ReadonlyMap<string, Readonly<SelectOption[]>>;

const syncControls = (node: HTMLFormElement, data: unknown, selectOptions?: SelectOptionsMap) => {
	const controls = node.querySelectorAll<NamedControl>('input[name], textarea[name], select[name]');
	for (const el of controls) {
		// Managed controls render their value declaratively from the data
		// store; writing to them here would fight Svelte for ownership.
		if (el.hasAttribute('data-conjure-managed')) {
			continue;
		}
		// Registered selects encode option indexes as DOM values while the
		// data holds the original option values; writing those back would
		// clear the selection.
		if (el instanceof HTMLSelectElement && selectOptions?.has(el.name)) {
			continue;
		}
		const value = getPath(data, el.name);
		if (el instanceof HTMLInputElement && el.type === 'file') {
			continue;
		}
		if (el instanceof HTMLInputElement && el.type === 'checkbox') {
			const next = !!value;
			if (el.checked !== next) {
				el.checked = next;
			}
		} else if (el instanceof HTMLInputElement && el.type === 'radio') {
			const next = value !== undefined && value !== null && toText(value) === el.value;
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

const deepMerge = (target: Record<string, unknown>, source: Record<string, unknown>) => {
	for (const [key, value] of Object.entries(source)) {
		const existing = target[key];
		if (
			value !== null &&
			typeof value === 'object' &&
			!Array.isArray(value) &&
			existing !== null &&
			typeof existing === 'object' &&
			!Array.isArray(existing)
		) {
			deepMerge(existing as Record<string, unknown>, value as Record<string, unknown>);
		} else {
			target[key] = value;
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

const isThenable = <X>(value: X | PromiseLike<X>): value is PromiseLike<X> =>
	typeof (value as { then?: unknown } | null | undefined)?.then === 'function';

interface SchemaNode {
	key: string;
	schema?: ZodTypeAny;
	hide: Resolvable<boolean>;
	children?: SchemaNode[];
}

// Traversal order and the stored hide resolvables are consumed by the hidden-field exclusion wiring in FormInstance.
const buildSchemaNodes = (elements: Readonly<BaseElement<string>[]>): SchemaNode[] => {
	const nodes: SchemaNode[] = [];
	for (const element of elements) {
		if (!('name' in element) || typeof element.name !== 'string') {
			continue;
		}
		const hide = element.hide ?? false;
		if (element.type === 'object' && 'elements' in element) {
			const objectElement = element as ObjectElement<BaseElement<string>>;
			nodes.push({
				key: objectElement.name,
				schema: objectElement.schema,
				hide,
				children: buildSchemaNodes(objectElement.elements)
			});
			continue;
		}
		if (!('schema' in element)) {
			continue;
		}
		nodes.push({ key: element.name, schema: element.schema as ZodTypeAny, hide });
	}
	return nodes;
};

export class FormInstance<T extends FormGenerator<BaseElement<string>>, E extends Readonly<BaseElement<string>[]>> {
	private readonly data: Writable<ReMapper<E>>;
	private readonly touched = writable<Record<string, boolean>>({});
	private readonly selectOptions = new Map<string, Readonly<SelectOption[]>>();
	private readonly schemaNodes: SchemaNode[];
	private readonly hiddenFlags: Readable<(boolean | undefined)[]>;
	private lastFlagsKey: string | undefined;
	private lastComposed: ZodObject | undefined;
	private readonly validation: Readable<{ valid: boolean; errors: Record<string, string[]> }>;
	private readonly errors: Readable<Record<string, string[]>>;

	constructor(
		public generator: T,
		public elements: E,
		private options: FormOptions<ReMapper<E>> = {}
	) {
		const seed: Record<string, unknown> = {};
		seedDefaults(elements, seed);
		if (options.data) {
			deepMerge(seed, structuredClone(options.data) as Record<string, unknown>);
		}
		this.data = writable(seed as ReMapper<E>);

		// TODO Support various validators
		this.schemaNodes = buildSchemaNodes(elements);
		const hiddenStores: Readable<boolean | undefined>[] = [];
		const collectHidden = (nodes: SchemaNode[]) => {
			for (const node of nodes) {
				hiddenStores.push(this.resolveField(node.hide));
				if (node.children) {
					collectHidden(node.children);
				}
			}
		};
		collectHidden(this.schemaNodes);
		this.hiddenFlags = storeArrayToStore(hiddenStores);
		this.validation = derived([this.data, this.hiddenFlags], ([$data, $flags]) => {
			const result = this.composeSchema($flags).safeParse($data);
			if (result.success) {
				return { valid: true, errors: {} };
			}
			const errors: Record<string, string[]> = {};
			for (const issue of result.error.issues) {
				const key = issue.path.join('.');
				(errors[key] ??= []).push(issue.message);
			}
			return { valid: false, errors };
		});
		this.errors = derived([this.validation, this.touched], ([$validation, $touched]) => {
			if ($touched['*']) {
				return $validation.errors;
			}
			return Object.fromEntries(Object.entries($validation.errors).filter(([key]) => $touched[key]));
		});
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
				this.data.update((data) => setPath(data, el.name, this.resolveControlValue(el)));
				this.touched.update((touched) => ({ ...touched, [el.name]: true }));
			};

			const handleSubmit = (event: Event) => {
				event.preventDefault();
				this.touched.update((touched) => ({ ...touched, '*': true }));
				if (this.validate()) {
					this.options.onSubmit?.(get(this.data));
				}
			};

			const unsubscribe = this.data.subscribe((data) => {
				syncControls(node, data, this.selectOptions);
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
	 * Coerce a control's DOM value, resolving index-encoded select options
	 * back to their original option values.
	 */
	private resolveControlValue(el: NamedControl): unknown {
		const value = coerceValue(el);
		if (!(el instanceof HTMLSelectElement)) {
			return value;
		}
		const options = this.selectOptions.get(el.name);
		if (!options) {
			return value;
		}
		if (Array.isArray(value)) {
			return value.map((index) => options[Number(index)]?.value);
		}
		return value === '' ? undefined : options[Number(value)]?.value;
	}

	/**
	 * Register the currently resolved options of a select-like control so
	 * selections resolve to the original option values (objects included).
	 * Controls rendered by conjure register automatically; custom elements
	 * can do the same and encode the option index as the DOM value.
	 */
	registerSelectOptions(name: string, options: Readonly<SelectOption[]>): void {
		this.selectOptions.set(name, options);
	}

	unregisterSelectOptions(name: string): void {
		this.selectOptions.delete(name);
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
		return derived(this.validation, ($validation) => $validation.valid);
	}

	/**
	 * Validation errors keyed by field path, filtered to touched fields
	 * (all fields count as touched after a submit attempt).
	 */
	getErrors(): Readable<Record<string, string[]>> {
		return this.errors;
	}

	/**
	 * Whether the current data is valid. Validation state itself is derived
	 * from the data store, so this is a read, not a mutation.
	 */
	validate(): boolean {
		return get(this.validation).valid;
	}

	resolveParams<X extends { [key: string]: unknown }>(
		input: BaseElement<string> & { name?: string; params?: Resolvable<X>; schema?: ZodTypeAny }
	): Readable<X> {
		let base = {
			...this.generator.getDefaultParams(input.type)
		} as X;

		if (input.schema) {
			const fromValidator = this.generator.getFromValidator<X>(input.type);
			if (fromValidator) {
				// TODO Support various validators
				base = fromValidator(base, fromZod(input.schema));
			}
		}

		if (input.params === undefined) {
			return writable(base);
		}

		const params = input.params;
		const merge = (resolved: X) => ({ ...base, ...resolved });

		if (typeof params === 'function') {
			return derived(
				this.data,
				($data, set) => {
					let cancelled = false;
					void Promise.resolve(params($data as { [key: string]: unknown })).then((resolved) => {
						if (!cancelled) {
							set(merge(resolved));
						}
					});
					return () => {
						cancelled = true;
					};
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
				if (!isThenable(resolvable)) {
					set(resolvable);
					return;
				}
				let cancelled = false;
				void Promise.resolve(resolvable).then((resolved) => {
					if (!cancelled) {
						set(resolved);
					}
				});
				return () => {
					cancelled = true;
				};
			});
		}

		if (field !== null && typeof field === 'object' && 'subscribe' in field) {
			return field;
		}

		if (!isThenable(field)) {
			return writable(field);
		}

		const result = writable<X>();
		void Promise.resolve(field).then((resolved) => {
			result.set(resolved);
		});
		return result;
	}

	private composeSchema(flags: readonly (boolean | undefined)[]): ZodObject {
		const key = flags.map((flag) => (flag ? '1' : '0')).join('');
		if (this.lastComposed && key === this.lastFlagsKey) {
			return this.lastComposed;
		}
		let index = 0;
		const build = (nodes: SchemaNode[]): ZodObject => {
			const shape: Record<string, ZodTypeAny> = {};
			for (const node of nodes) {
				const hidden = flags[index++] === true;
				if (node.children) {
					// Children flags are consumed even when the object is
					// hidden so the cursor stays aligned with the store order.
					const childSchema = build(node.children);
					if (!hidden) {
						shape[node.key] = node.schema ?? childSchema;
					}
				} else if (!hidden && node.schema) {
					shape[node.key] = node.schema;
				}
			}
			return zod.object(shape);
		};
		const composed = build(this.schemaNodes);
		this.lastFlagsKey = key;
		this.lastComposed = composed;
		return composed;
	}

	/**
	 * The currently effective validation schema: object schemas compose from
	 * their children unless explicitly provided, and hidden fields are
	 * excluded while hidden.
	 */
	getValidationSchema(): ZodObject {
		return this.composeSchema(get(this.hiddenFlags));
	}
}
