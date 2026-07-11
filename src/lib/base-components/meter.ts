import type { HTMLMeterAttributes } from 'svelte/elements';

import type { BaseElement, Resolvable, StripName } from '../types.js';

export interface MeterElement extends BaseElement<'meter'> {
	value: Resolvable<number>;
	params?: Resolvable<StripName<HTMLMeterAttributes>>;
}
