import type { HTMLProgressAttributes } from 'svelte/elements';

import type { BaseElement, Resolvable, StripName } from '../types.js';

export interface ProgressElement extends BaseElement<'progress'> {
	value: Resolvable<number>;
	params?: Resolvable<StripName<HTMLProgressAttributes>>;
}
