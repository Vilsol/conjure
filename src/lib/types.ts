import 'svelte2tsx/svelte-jsx';

import type { ZodTypeAny } from 'zod';

export type WithClass<T> = Partial<
  T & {
    class: string;
  }
>;

export type StripName<T> = Omit<WithClass<T>, 'name'>;

export type Resolvable<T> = T | PromiseLike<T> | ((data: { [key: string]: unknown }) => T | PromiseLike<T>);

export interface BaseElement<T extends string> {
  type: T;
  component?: unknown;
  hide?: Resolvable<boolean>;
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
