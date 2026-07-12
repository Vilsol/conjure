/** Text form of a primitive form value; non-primitives render as ''. */
export const toText = (value: unknown): string =>
	typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' ? String(value) : '';
