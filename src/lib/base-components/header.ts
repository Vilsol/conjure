import type { BaseElement, Resolvable, WithClass } from '../types';

export interface HeaderElement extends BaseElement<'header'> {
  text: string;
  size?: 1 | 2 | 3 | 4 | 5 | 6;
  params?: Resolvable<WithClass<HTMLElement>>;
}
