import type { Extender, FieldsSetter } from '@felte/common';
import { reporter as svelteReporter } from '@felte/reporter-svelte';
import { validator as zodValidator } from '@felte/validator-zod';
import { createForm } from 'felte';
import type { Readable, Unsubscriber, Writable } from 'svelte/store';
import { derived, writable } from 'svelte/store';
import type { ZodObject, ZodRawShape, ZodTypeAny } from 'zod';
import * as zod from 'zod';

import type { FormGenerator } from './generator.js';
import type { ArrayElement, BaseElement, ObjectElement, Resolvable } from './types.js';
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

type ReMapper<E extends Readonly<BaseElement<string>[]>> = {
	[key in Extract<E[number], { name: string }> as key['name']]: E[number] extends { name: string }
		? SubRemap<E[number]>
		: never;
};

export class FormInstance<T extends FormGenerator<BaseElement<string>>, E extends Readonly<BaseElement<string>[]>> {
	private readonly data: Writable<ReMapper<E>>;
	private setFields: FieldsSetter<Record<string, unknown>> | undefined;
	private dataSubscriber: Unsubscriber | undefined;
	private updating = false;

	constructor(
		public generator: T,
		public elements: E
	) {
		this.data = writable({} as ReMapper<E>);

		this.data.subscribe((value) => {
			if (!this.updating && this.setFields) {
				this.setFields(value as Record<string, unknown>);
			}
			this.updating = false;
		});
	}

	createForm() {
		const { form, data, setFields } = createForm({
			initialValues: {}, // TODO Initial values
			extend: this.getExtensions(),
			onSubmit: console.log // TODO Submit handling
		});

		if (this.dataSubscriber) {
			this.dataSubscriber();
			this.dataSubscriber = undefined;
		}

		this.setFields = setFields;
		this.dataSubscriber = data.subscribe((d) => {
			// TODO Figure out a cleaner way
			this.updating = true;
			this.data.set(d as ReMapper<E>);
		});

		return form;
	}

	getData(): Writable<ReMapper<E>> {
		return this.data;
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
	getValidationSchema(): ZodObject<ZodRawShape> {
		return zod.object(
			this.elements.reduce<ZodRawShape>((base, value) => {
				if ('schema' in value && 'name' in value) {
					base[value.name as string] = value.schema as ZodTypeAny;
				}
				return base;
			}, {})
		);
	}

	// TODO Support various validators
	getValidator(): Extender {
		return zodValidator({
			schema: this.getValidationSchema()
		});
	}

	// TODO Support various reporters
	getReporter(): Extender {
		return svelteReporter;
	}

	// TODO Expandable extensions
	getExtensions(): Extender[] {
		return [this.getValidator(), this.getReporter()];
	}
}
