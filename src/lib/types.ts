import 'svelte2tsx/svelte-jsx';

import type { Readable } from 'svelte/store';
import type { SomeZodObject, ZodArray, ZodTypeAny } from 'zod';

export type WithClass<T> = Partial<
  T & {
    class: string;
  }
>;

export type StripName<T> = Omit<WithClass<T>, 'name'>;

export type Resolvable<T> =
  | T
  | PromiseLike<T>
  | ((data: { [key: string]: unknown }) => T | PromiseLike<T>)
  | Readable<T>;

export interface BaseElement<T extends string> {
  type: T;
  component?: unknown;
  hide?: Resolvable<boolean>;
}

type DistributiveOmit<T, K extends string> = T extends T ? Omit<T, K> : never;

export interface ArrayElement<T extends BaseElement<string>> extends BaseElement<'array'> {
  name: string;
  schema: ZodArray<ZodTypeAny>;
  element: DistributiveOmit<T | ArrayElement<T> | ObjectElement<T>, 'name'>;
  count: Resolvable<number>;
}

export interface ObjectElement<T extends BaseElement<string>> extends BaseElement<'object'> {
  name: string;
  schema: SomeZodObject;
  elements: Readonly<(T | ObjectElement<T> | ArrayElement<T>)[]>;
}

export interface BaseInput<T extends string> extends BaseElement<T> {
  name: string;
  schema: ZodTypeAny;
  label?: string;
  components?: {
    wrapper?: unknown;
    label?: unknown;
  };
}
