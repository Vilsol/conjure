import type { BaseInput, Resolvable, StripName } from '../types';

export interface TextareaElement extends BaseInput<'textarea'> {
  params?: Resolvable<StripName<HTMLTextAreaElement>>;
}
