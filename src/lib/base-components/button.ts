import type { BaseElement, Resolvable, StripName } from '../types.js';
import type { HTMLButtonAttributes } from 'svelte/elements';

export interface ButtonElement extends BaseElement<'button'> {
	text: Resolvable<string>;
	click: () => void;
	params?: Resolvable<StripName<HTMLButtonAttributes>>;
}
