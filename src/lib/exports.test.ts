import { describe, expect, it } from 'vitest';

import { Form, Label, Wrapper } from './index.js';

describe('package exports', () => {
	it('exposes the common components', () => {
		expect(Form).toBeDefined();
		expect(Wrapper).toBeDefined();
		expect(Label).toBeDefined();
	});
});
