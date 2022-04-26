import type { BaseElement, Resolvable, StripName } from '../types';

export interface ButtonElement extends BaseElement<'button'> {
  text: Resolvable<string>;
  click: () => void;
  params?: Resolvable<StripName<HTMLButtonElement>>;
}
