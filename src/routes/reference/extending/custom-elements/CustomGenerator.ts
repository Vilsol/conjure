import { Base } from '$lib';
import CustomSwitch from './CustomSwitch.svelte';
import type { HTMLInputAttributes } from 'svelte/elements';
import type { BaseInput, Resolvable, StripName } from '$lib/types.js';

export interface SwitchElement extends BaseInput<'switch'> {
	params?: Resolvable<StripName<HTMLInputAttributes>>;
}

export const CustomGenerator = Base.withType<SwitchElement>('switch', CustomSwitch);
