import type {
  ButtonElement,
  HeaderElement,
  InputElement,
  MeterElement,
  ProgressElement,
  SelectElement,
  TextareaElement
} from './base-components';
import {
  Array,
  Button,
  Header,
  Input,
  Meter,
  Object,
  Progress,
  Select,
  Textarea,
  inputFromValidatorToParams
} from './base-components';
import { FormGenerator } from './generator';

export const Core = new FormGenerator()
  .withType<never>('array' as never, Array)
  .withType<never>('object' as never, Object);

export const Base = Core.withType<InputElement>('input', Input, inputFromValidatorToParams)
  .withType<TextareaElement>('textarea', Textarea)
  .withType<SelectElement>('select', Select)
  .withType<HeaderElement>('header', Header)
  .withType<ButtonElement>('button', Button)
  .withType<MeterElement>('meter', Meter)
  .withType<ProgressElement>('progress', Progress);
