import { ZodDefault, ZodNullable, ZodNumber, ZodOptional, ZodString } from 'zod';
import type { ZodTypeAny } from 'zod';

import type { ValidatorDefinition } from './types.js';

const unwrap = (schema: ZodTypeAny): ZodTypeAny => {
	for (;;) {
		if (schema instanceof ZodOptional || schema instanceof ZodNullable) {
			schema = (schema as ZodOptional<ZodTypeAny>).unwrap();
		} else if (schema instanceof ZodDefault) {
			schema = (schema as ZodDefault<ZodTypeAny>).removeDefault();
		} else {
			return schema;
		}
	}
};

export const fromZod = (schema: ZodTypeAny): ValidatorDefinition => {
	const def: ValidatorDefinition = {};

	schema = unwrap(schema);

	if (schema instanceof ZodString) {
		if (schema.isEmail) {
			def.type = 'email';
		}

		if (schema.isURL) {
			def.type = 'url';
		}

		if (schema.minLength !== null && schema.minLength !== -Infinity) {
			def.min = schema.minLength;
		}

		if (schema.maxLength !== null) {
			def.max = schema.maxLength;
		}
	}

	if (schema instanceof ZodNumber) {
		def.type = 'number';
		if (schema.minValue !== null) {
			def.min = schema.minValue;
		}

		if (schema.maxValue !== null) {
			def.max = schema.maxValue;
		}
	}

	return def;
};
