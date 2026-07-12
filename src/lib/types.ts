import 'svelte2tsx/svelte-jsx';

import type { StandardSchemaV1 } from '@standard-schema/spec';
import type { Readable } from 'svelte/store';
import type { Component } from 'svelte';
import type { FormInstance } from '$lib/instance.js';
import type { FormGenerator } from '$lib/generator.js';

export type WithClass<T> = Partial<
	T & {
		class: string;
	}
>;

export type StripName<T> = Omit<WithClass<T>, 'name'>;

// The function arm uses method syntax so its data parameter is checked
// bivariantly: callbacks may narrow it to the form's inferred data type
// (e.g. `(data: ReMapper<typeof fields>) => ...`), which strictFunctionTypes
// would otherwise reject as contravariant.
export type Resolvable<T> =
	T | PromiseLike<T> | { resolve(data: { [key: string]: unknown }): T | PromiseLike<T> }['resolve'] | Readable<T>;

export interface BaseElement<T extends string> {
	type: T;
	component?: Component;
	hide?: Resolvable<boolean>;
}

export type ExtractBaseElement<T> = T extends BaseElement<infer S> ? S : never;

type DistributiveOmit<T, K extends string> = T extends T ? Omit<T, K> : never;

export interface ArrayElement<T extends BaseElement<string>> extends BaseElement<'array'> {
	name: string;
	schema: StandardSchemaV1;
	element: DistributiveOmit<T | ArrayElement<T> | ObjectElement<T>, 'name'>;
	count: Resolvable<number>;
}

export interface ObjectElement<T extends BaseElement<string>> extends BaseElement<'object'> {
	name: string;
	schema?: StandardSchemaV1;
	elements: Readonly<(T | ObjectElement<T> | ArrayElement<T>)[]>;
}

export interface BaseInput<T extends string> extends BaseElement<T> {
	name: string;
	schema: StandardSchemaV1;
	value?: unknown;
	label?: string;
	components?: {
		wrapper?: Component;
		label?: Component;
	};
}

export type BaseProps<T extends BaseElement<string>> = {
	definition: T;
	form: FormInstance<FormGenerator<BaseElement<string>>, Readonly<BaseElement<string>[]>>;
	prefix: string;
};
