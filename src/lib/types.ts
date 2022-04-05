import 'svelte2tsx/svelte-jsx';

import type { ZodTypeAny } from 'zod';

type WithClass<T> = Partial<
  T & {
    class: string;
  }
>;

type StripName<T> = Omit<WithClass<T>, 'name'>;

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

export interface Input extends BaseInput<'input'> {
  params?: Resolvable<StripName<svelteHTML.SvelteInputProps>>;
}

export interface SelectOption {
  label: string;
  value: unknown;
}

export interface Select extends BaseInput<'select'> {
  options: Resolvable<Readonly<SelectOption[]>>;
  params?: Resolvable<StripName<HTMLSelectElement>>;
}

export interface Textarea extends BaseInput<'textarea'> {
  params?: Resolvable<StripName<HTMLTextAreaElement>>;
}

export interface Header extends BaseElement<'header'> {
  text: string;
  size?: 1 | 2 | 3 | 4 | 5 | 6;
  params?: Resolvable<WithClass<HTMLElement>>;
}
