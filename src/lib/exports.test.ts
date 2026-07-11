import { describe, expect, it } from 'vitest';

import { Form, Label, Wrapper, setLabelParam, setWrapperParam } from './index.js';

describe('package exports', () => {
	it('exposes the common components and their setParam functions', () => {
		expect(Form).toBeDefined();
		expect(Wrapper).toBeDefined();
		expect(Label).toBeDefined();
		expect(setWrapperParam).toBeTypeOf('function');
		expect(setLabelParam).toBeTypeOf('function');
	});
});
