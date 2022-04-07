import type { HeaderElement, InputElement, SelectElement, TextareaElement } from './base-components';
import { Header, Input, Select, Textarea, inputFromValidatorToParams } from './base-components';
import { FormGenerator } from './generator';

export const Base = new FormGenerator()
  .withType<InputElement>('input', Input, inputFromValidatorToParams)
  .withType<TextareaElement>('textarea', Textarea)
  .withType<SelectElement>('select', Select)
  .withType<HeaderElement>('header', Header);
