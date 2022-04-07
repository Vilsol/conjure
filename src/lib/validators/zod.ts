import { ZodNumber, ZodOptional, ZodString } from 'zod';
import type { ZodTypeAny } from 'zod';

import type { ValidatorDefinition } from './types';

export const fromZod = (schema: ZodTypeAny): ValidatorDefinition => {
  const def: ValidatorDefinition = {};

  if (schema instanceof ZodOptional) {
    schema = schema.unwrap();
  }

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
