import type { BaseInput, Resolvable, StripName } from '../types';
import type { ValidatorDefinition } from '../validators';

export interface InputElement extends BaseInput<'input'> {
  params?: Resolvable<StripName<svelteHTML.SvelteInputProps>>;
}

export const fromValidatorToParams = (
  params: StripName<svelteHTML.SvelteInputProps>,
  definition: ValidatorDefinition
): StripName<svelteHTML.SvelteInputProps> => {
  const result = {
    ...params
  };

  definition.type && (result.type = definition.type);

  switch (result.type) {
    case 'number':
      definition.min && (result.min = definition.min);
      definition.max && (result.max = definition.max);
      break;
    default:
      definition.min && (result.minlength = definition.min);
      definition.max && (result.maxlength = definition.max);
      break;
  }

  return result;
};
