import type { HTMLSelectAttributes } from 'svelte/elements';

import type { BaseInput, Resolvable, StripName } from '../types.js';

export interface SelectOption {
	label: string;
	value: unknown;
}

export interface SelectElement extends BaseInput<'select'> {
	options: Resolvable<Readonly<SelectOption[]>>;
	params?: Resolvable<StripName<HTMLSelectAttributes>>;
}
