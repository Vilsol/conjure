import type { HTMLTextareaAttributes } from 'svelte/elements';

import type { BaseInput, Resolvable, StripName } from '../types.js';

export interface TextareaElement extends BaseInput<'textarea'> {
	params?: Resolvable<StripName<HTMLTextareaAttributes>>;
}
