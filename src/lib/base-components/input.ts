import type { BaseInput, Resolvable, StripName } from '../types.js';
import type { ValidatorDefinition } from '../validators/index.js';
import type { HTMLInputAttributes } from 'svelte/elements';

export interface InputElement extends BaseInput<'input'> {
	params?: Resolvable<StripName<HTMLInputAttributes>>;
}

export const fromValidatorToParams = (
	params: StripName<HTMLInputAttributes>,
	definition: ValidatorDefinition
): StripName<HTMLInputAttributes> => {
	const result = {
		...params
	};

	if (definition.type) {
		result.type = definition.type;
	}

	switch (result.type) {
		case 'number':
			if (definition.min !== undefined) {
				result.min = definition.min;
			}

			if (definition.max !== undefined) {
				result.max = definition.max;
			}
			break;
		default:
			if (definition.min !== undefined) {
				result.minlength = definition.min;
			}

			if (definition.max !== undefined) {
				result.maxlength = definition.max;
			}
			break;
	}

	return result;
};
