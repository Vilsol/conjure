import type { StandardSchemaV1 } from '@standard-schema/spec';
import { ZodDefault, ZodNullable, ZodNumber, ZodOptional, ZodString, ZodStringFormat } from 'zod';
import type { ZodTypeAny } from 'zod';

import type { ValidatorDefinition } from './types.js';

const unwrap = (schema: ZodTypeAny): ZodTypeAny => {
	for (;;) {
		if (schema instanceof ZodOptional || schema instanceof ZodNullable) {
			schema = schema.unwrap() as ZodTypeAny;
		} else if (schema instanceof ZodDefault) {
			schema = schema.removeDefault() as ZodTypeAny;
		} else {
			return schema;
		}
	}
};

// Accepts any Standard Schema; attribute extraction is Zod-only since the
// spec exposes no introspection — non-Zod schemas yield an empty definition.
export const fromSchema = (input: StandardSchemaV1): ValidatorDefinition => {
	const def: ValidatorDefinition = {};

	const schema = unwrap(input as unknown as ZodTypeAny);

	if (schema instanceof ZodString || schema instanceof ZodStringFormat) {
		const format = 'format' in schema ? schema.format : null;
		if (format === 'email') {
			def.type = 'email';
		}

		if (format === 'url') {
			def.type = 'url';
		}

		if (schema.minLength !== null) {
			def.min = schema.minLength;
		}

		if (schema.maxLength !== null) {
			def.max = schema.maxLength;
		}
	}

	if (schema instanceof ZodNumber) {
		def.type = 'number';
		if (schema.minValue !== null && Number.isFinite(schema.minValue)) {
			def.min = schema.minValue;
		}

		if (schema.maxValue !== null && Number.isFinite(schema.maxValue)) {
			def.max = schema.maxValue;
		}
	}

	return def;
};
