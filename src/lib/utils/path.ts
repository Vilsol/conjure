type Container = { [key: string]: unknown } | unknown[];

const isIndex = (segment: string) => /^\d+$/.test(segment);

const write = (target: Container, key: string, value: unknown) => {
	if (Array.isArray(target)) {
		target[Number(key)] = value;
	} else {
		target[key] = value;
	}
};

const read = (target: unknown, key: string): unknown => {
	if (target === null || typeof target !== 'object') {
		return undefined;
	}
	return (target as { [key: string]: unknown })[key];
};

/**
 * Set a value in a nested object by dot-separated path, creating intermediate
 * objects (or arrays for numeric segments) as needed. Mutates and returns root.
 */
export const setPath = <T extends { [key: string]: unknown }>(root: T, path: string, value: unknown): T => {
	const segments = path.split('.');
	let current: Container = root;

	for (let i = 0; i < segments.length - 1; i++) {
		const segment = segments[i];
		let next = read(current, segment);
		if (next === null || typeof next !== 'object') {
			next = isIndex(segments[i + 1]) ? [] : {};
			write(current, segment, next);
		}
		current = next as Container;
	}

	write(current, segments[segments.length - 1], value);
	return root;
};

type Primitive = string | number | boolean | bigint | symbol | null | undefined;

// Recursion is depth-capped so recursive schema output types cannot send the
// compiler into unbounded instantiation (TS2589).
type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7];

/**
 * All dot-separated paths into T. Array elements are addressed by numeric
 * segment (`tags.0`).
 */
export type FieldPath<T, D extends number = 8> = [D] extends [never]
	? never
	: T extends Primitive
		? never
		: T extends readonly (infer U)[]
			? `${number}` | `${number}.${FieldPath<U, Prev[D]>}`
			: { [K in keyof T & string]: K | `${K}.${FieldPath<T[K], Prev[D]>}` }[keyof T & string];

/**
 * The value type at a dot-separated path into T. Array lookups include
 * `undefined` since the index may be out of bounds.
 */
export type PathValue<T, P extends string> = T extends Primitive
	? undefined
	: P extends `${infer K}.${infer Rest}`
		? T extends readonly (infer U)[]
			? PathValue<U, Rest>
			: K extends keyof T
				? PathValue<T[K], Rest>
				: unknown
		: T extends readonly (infer U)[]
			? U | undefined
			: P extends keyof T
				? T[P]
				: unknown;

/**
 * Read a value from a nested object by dot-separated path.
 *
 * When the root's shape is known and the path is a literal within it, the
 * result is typed via PathValue; otherwise it falls back to unknown.
 */
export function getPath<T, P extends FieldPath<T> & string>(root: T, path: P): PathValue<T, P>;
export function getPath(root: unknown, path: string): unknown;
export function getPath(root: unknown, path: string): unknown {
	return path.split('.').reduce<unknown>((current, segment) => read(current, segment), root);
}
