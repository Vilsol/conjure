import type { BaseElement, Resolvable, StripName } from '../types';

export interface ProgressElement extends BaseElement<'progress'> {
  value: Resolvable<number>;
  params?: Resolvable<StripName<HTMLMeterElement>>;
}
