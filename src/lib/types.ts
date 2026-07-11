import 'svelte2tsx/svelte-jsx';

import type { Readable } from 'svelte/store';
import type { ZodArray, ZodObject, ZodTypeAny } from 'zod';
import type { Component } from 'svelte';
import type { FormInstance } from '$lib/instance.js';
import type { FormGenerator } from '$lib/generator.js';

export type WithClass<T> = Partial<
	T & {
		class: string;
	}
>;

export type StripName<T> = Omit<WithClass<T>, 'name'>;

export type Resolvable<T> =
	T | PromiseLike<T> | ((data: { [key: string]: unknown }) => T | PromiseLike<T>) | Readable<T>;

export interface BaseElement<T extends string> {
	type: T;
	component?: Component;
	hide?: Resolvable<boolean>;
}

export type ExtractBaseElement<T> = T extends BaseElement<infer S> ? S : never;

type DistributiveOmit<T, K extends string> = T extends T ? Omit<T, K> : never;

export interface ArrayElement<T extends BaseElement<string>> extends BaseElement<'array'> {
	name: string;
	schema: ZodArray<ZodTypeAny>;
	element: DistributiveOmit<T | ArrayElement<T> | ObjectElement<T>, 'name'>;
	count: Resolvable<number>;
}

export interface ObjectElement<T extends BaseElement<string>> extends BaseElement<'object'> {
	name: string;
	schema: ZodObject;
	elements: Readonly<(T | ObjectElement<T> | ArrayElement<T>)[]>;
}

export interface BaseInput<T extends string> extends BaseElement<T> {
	name: string;
	schema: ZodTypeAny;
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
