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

/**
 * Read a value from a nested object by dot-separated path.
 */
export const getPath = (root: unknown, path: string): unknown =>
	path.split('.').reduce<unknown>((current, segment) => read(current, segment), root);
