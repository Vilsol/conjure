import type { BaseElement, Resolvable, StripName } from '../types';

export interface MeterElement extends BaseElement<'meter'> {
  value: Resolvable<number>;
  params?: Resolvable<StripName<HTMLMeterElement>>;
}
