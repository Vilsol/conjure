# Core Review Item 5 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Resolve the remaining CORE-REVIEW.md section 5 items: hidden fields excluded from validation (reactive), object schemas derived from children, `withContainer` replacing the `'array' as never` casts, `withDefaultParam` widened to `unknown`, plus three cosmetic follow-ups (shared `toText`, `getDefaultParams` copy, stale TODO).

**Architecture:** Per the approved spec (`docs/superpowers/specs/2026-07-12-core-review-item5-design.md`). `FormInstance` builds a tree of schema nodes `(key, schema?, hidden, children?)` once in the constructor; hide states resolve through `resolveField` and flatten via `storeArrayToStore` into one flags store; `validation` derives from `[data, hiddenFlags]` and composes the effective zod schema (memoized by flags) — hidden nodes and their subtrees are omitted, objects without explicit schemas are composed recursively from visible children.

**Tech Stack:** Svelte 5 stores, zod 4, vitest (jsdom), TypeScript.

**Conventions:** Tabs. Helpers: `mountForm(elements, options?, generator = Base)`, `setInput`, `tick`, module `cleanup` in `src/lib/form-core.test.ts`; `makeGenerator`, `tick` in `src/lib/instance.test.ts`. Gates: `pnpm test`, `pnpm check`, `pnpm lint`. Husky pre-commit runs prettier/eslint/svelte-check; commitlint enforces conventional commits.

**Behavior notes (document, don't "fix"):**
- Hide resolution is async by construction (`resolveField` sets via microtask), so a form is briefly "all fields visible" for one microtask after creation/data change; tests must `await tick()` after construction or `data.set` before asserting validity.
- Hidden fields' values stay in the data store and in `onSubmit` payloads.
- `hide` inside an array's `element` definition is not consulted for validation.
- An explicit object schema is authoritative: hidden children are not filtered out of it.

---

### Task 1: Branch setup

- [ ] **Step 1: Create the working branch**

```bash
cd /home/vilsol/Projects/Vilsol/conjure
git checkout -b core-review-5
```

---

### Task 2: Shared `toText` helper unifying radio value matching

Pure refactor — no red test possible; existing radio tests (form-core.test.ts `radio groups` + `hand-written controls via createForm` describes) pin the behavior.

**Files:**
- Create: `src/lib/utils/text.ts`
- Modify: `src/lib/base-components/Input.svelte:18-19` (remove local `toText`, import shared), `src/lib/instance.ts:88-94` (radio branch uses shared `toText`)

- [ ] **Step 1: Create the util**

`src/lib/utils/text.ts`:

```ts
/** Text form of a primitive form value; non-primitives render as ''. */
export const toText = (value: unknown): string =>
	typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' ? String(value) : '';
```

- [ ] **Step 2: Use it in Input.svelte**

Delete the local `toText` const (lines 18-19) and add to the imports:

```ts
	import { toText } from '$lib/utils/text.js';
```

- [ ] **Step 3: Use it in instance.ts**

Add `import { toText } from './utils/text.js';` and replace the radio branch condition in `syncControls`:

```ts
		} else if (el instanceof HTMLInputElement && el.type === 'radio') {
			const next = value !== undefined && value !== null && toText(value) === el.value;
			if (el.checked !== next) {
				el.checked = next;
			}
		}
```

- [ ] **Step 4: Run the full suite**

Run: `pnpm test`
Expected: 117/117 PASS (radio tests pin the semantics).

- [ ] **Step 5: Commit**

```bash
git add src/lib/utils/text.ts src/lib/base-components/Input.svelte src/lib/instance.ts
git commit -m "refactor: share radio value-matching via a toText util"
```

---

### Task 3: Generator — `withDefaultParam` unknown, `getDefaultParams` copy, `withContainer`

**Files:**
- Modify: `src/lib/generator.ts`, `src/lib/base.ts`
- Test: `src/lib/generator.test.ts`, `src/lib/type-inference.test.ts`, `src/lib/form-core.test.ts`

- [ ] **Step 1: Write the failing tests**

In `src/lib/form-core.test.ts` (add to `describe('common component params')` or a new describe):

```ts
describe('default params', () => {
	it('applies non-string default params to the DOM', async () => {
		const generator = Base.withDefaultParam('input', 'disabled', true);
		const { target } = await mountForm(
			[{ type: 'input', name: 'a', schema: z.string() }] as never,
			undefined,
			generator
		);

		expect(target.querySelector('input')!.disabled).toBe(true);
	});
});
```

In `src/lib/generator.test.ts` (reuse the file's existing stubs/imports):

```ts
describe('withContainer', () => {
	it('registers a component without extending the element union', () => {
		const generator = new FormGenerator().withContainer('array', DummyInput);

		expectTypeOf(generator).toEqualTypeOf<FormGenerator<never>>();
	});

	it('makes the container component retrievable', () => {
		const generator = new FormGenerator()
			.withContainer('array', DummyInput)
			.withType<InputElement, StripName<HTMLInputAttributes>>('input', DummyInput, fromValidatorToParams);

		expect(generator.getComponent('array' as never)).toBe(DummyInput);
	});

	it('returns a copy from getDefaultParams', () => {
		const generator = new FormGenerator()
			.withType<InputElement, StripName<HTMLInputAttributes>>('input', DummyInput, fromValidatorToParams)
			.withDefaultParam('input', 'placeholder', 'Enter');

		const params = generator.getDefaultParams('input');
		params.placeholder = 'mutated';
		expect(generator.getDefaultParams('input')).toEqual({ placeholder: 'Enter' });
	});
});
```

Add `expectTypeOf` to the vitest import in generator.test.ts if missing.

- [ ] **Step 2: Verify red**

Run: `pnpm vitest run src/lib/generator.test.ts src/lib/form-core.test.ts`
Expected: `withContainer is not a function`; the copy test fails (mutation leaks into the generator). The `disabled: true` test is red at the type level — confirm with `pnpm check` reporting an error on the `withDefaultParam('input', 'disabled', true)` call (runtime may pass; the type error is the red).

- [ ] **Step 3: Implement in generator.ts**

Widen the constructor's second map and add the third-map passthrough unchanged:

```ts
	constructor(
		private typeRegistry: Map<string, TypeRegistryElement<unknown>> = new Map(),
		private defaultParams: Map<string, { [key: string]: unknown }> = new Map(),
		private commonParams: Map<CommonSlot, { [key: string]: unknown }> = new Map()
	) {}
```

Update `withDefaultParam` and `getDefaultParams`:

```ts
	/**
	 * Add a parameter on an element type as a default parameter
	 * @param typeName Element type name
	 * @param param Parameter name
	 * @param value Default value
	 */
	withDefaultParam(typeName: T['type'], param: string, value: unknown): FormGenerator<T> {
		const newDefaultParams = new Map(this.defaultParams);
		const allParams = { ...(newDefaultParams.get(typeName) || {}) };
		allParams[param] = value;
		newDefaultParams.set(typeName, allParams);
		return new FormGenerator(new Map(this.typeRegistry), newDefaultParams, new Map(this.commonParams));
	}

	/**
	 * Get all the default params for a type
	 * @param typeName The type name
	 */
	getDefaultParams(typeName: T['type']): { [key: string]: unknown } {
		return { ...(this.defaultParams.get(typeName) || {}) };
	}
```

Add `withContainer` (below `withType`):

```ts
	/**
	 * Register a structural container component (array/object) without
	 * adding it to the element type union
	 * @param type Container type name
	 * @param component Container component
	 */
	withContainer<M extends BaseElement<string>>(type: string, component: Component<BaseProps<M>>): FormGenerator<T> {
		const newTypeRegistry = new Map(this.typeRegistry);
		newTypeRegistry.set(type, {
			component: component as Component<BaseProps<BaseElement<string>>>
		});
		return new FormGenerator(newTypeRegistry, new Map(this.defaultParams), new Map(this.commonParams));
	}
```

- [ ] **Step 4: Rewrite Core in base.ts**

```ts
export const Core = new FormGenerator().withContainer('array', Array).withContainer('object', Object);
```

(The `.withType<never>('array' as never, ...)` lines are deleted; `Base` chain below is unchanged.)

- [ ] **Step 5: Verify green + types**

Run: `pnpm test && pnpm check`
Expected: all pass, including existing array/object rendering suites (`components.test.ts`, ReMapper type tests).

- [ ] **Step 6: Commit**

```bash
git add src/lib/generator.ts src/lib/base.ts src/lib/generator.test.ts src/lib/form-core.test.ts
git commit -m "feat: add withContainer and widen default params to unknown"
```

---

### Task 4: Object schemas derived from children (schema-node tree)

**Files:**
- Modify: `src/lib/types.ts` (ObjectElement.schema optional), `src/lib/instance.ts` (schema-node tree + recursive composition; no hidden wiring yet)
- Test: `src/lib/form-core.test.ts`

- [ ] **Step 1: Write the failing tests**

In `src/lib/form-core.test.ts`:

```ts
describe('derived object schemas', () => {
	it('validates nested objects without an explicit object schema', async () => {
		const form = Base.newForm([
			{
				type: 'object',
				name: 'address',
				elements: [{ type: 'input', name: 'street', schema: z.string().min(3) }]
			}
		] as never);

		await tick();
		expect(form.validate()).toBe(false);

		form.getData().set({ address: { street: 'Main St' } } as never);
		await tick();
		expect(form.validate()).toBe(true);
	});

	it('prefers an explicit object schema over derived children', async () => {
		const form = Base.newForm(
			[
				{
					type: 'object',
					name: 'address',
					schema: z.object({}),
					elements: [{ type: 'input', name: 'street', schema: z.string().min(3) }]
				}
			] as never,
			{ data: { address: {} } } as never
		);

		await tick();
		expect(form.validate()).toBe(true);
	});
});
```

- [ ] **Step 2: Verify red**

Run: `pnpm vitest run src/lib/form-core.test.ts`
Expected: first test FAILS at `expect(form.validate()).toBe(false)` — received `true`, because objects without a schema are currently skipped entirely by the flat reduce. Second test passes already (explicit schema is included today) — keep as a regression pin.

- [ ] **Step 3: Make ObjectElement.schema optional**

In `src/lib/types.ts`:

```ts
export interface ObjectElement<T extends BaseElement<string>> extends BaseElement<'object'> {
	name: string;
	schema?: ZodObject;
	elements: Readonly<(T | ObjectElement<T> | ArrayElement<T>)[]>;
}
```

- [ ] **Step 4: Build the schema-node tree in instance.ts**

Add above the class:

```ts
interface SchemaNode {
	key: string;
	schema?: ZodTypeAny;
	hide: Resolvable<boolean>;
	children?: SchemaNode[];
}

const buildSchemaNodes = (elements: Readonly<BaseElement<string>[]>): SchemaNode[] => {
	const nodes: SchemaNode[] = [];
	for (const element of elements) {
		if (!('name' in element) || typeof element.name !== 'string') {
			continue;
		}
		const hide = element.hide ?? false;
		if (element.type === 'object' && 'elements' in element) {
			const objectElement = element as ObjectElement<BaseElement<string>>;
			nodes.push({
				key: objectElement.name,
				schema: objectElement.schema,
				hide,
				children: buildSchemaNodes(objectElement.elements)
			});
			continue;
		}
		if (!('schema' in element)) {
			continue;
		}
		nodes.push({ key: element.name, schema: element.schema as ZodTypeAny, hide });
	}
	return nodes;
};
```

In the class add a field and replace the constructor's schema block (delete the `this.schema` field and its assignment; `validation` now composes):

```ts
	private readonly schemaNodes: SchemaNode[];
```

```ts
		// TODO Support various validators
		this.schemaNodes = buildSchemaNodes(elements);
		this.validation = derived(this.data, ($data) => {
			const result = this.composeSchema().safeParse($data);
			...unchanged issue-mapping...
		});
```

Add the composition method (hidden filtering arrives in Task 5 — for now no flags):

```ts
	private composeSchema(): ZodObject {
		const build = (nodes: SchemaNode[]): ZodObject => {
			const shape: Record<string, ZodTypeAny> = {};
			for (const node of nodes) {
				if (node.children) {
					const childSchema = build(node.children);
					shape[node.key] = node.schema ?? childSchema;
				} else if (node.schema) {
					shape[node.key] = node.schema;
				}
			}
			return zod.object(shape);
		};
		return build(this.schemaNodes);
	}
```

`getValidationSchema()` becomes:

```ts
	getValidationSchema(): ZodObject {
		return this.composeSchema();
	}
```

(The stale `// TODO Support various validators` above `getValidationSchema` is deleted — it stays only at the constructor. This completes the third extra.)

- [ ] **Step 5: Verify green**

Run: `pnpm test && pnpm check`
Expected: all pass, including `instance.test.ts`'s `getValidationSchema` shape test and every nested-object suite. If the ReMapper type tests complain about optional schema, STOP and report — do not weaken type tests.

- [ ] **Step 6: Commit**

```bash
git add src/lib/types.ts src/lib/instance.ts src/lib/form-core.test.ts
git commit -m "feat: derive object validation schemas from child elements"
```

---

### Task 5: Hidden fields excluded from validation

**Files:**
- Modify: `src/lib/instance.ts`
- Test: `src/lib/form-core.test.ts`

- [ ] **Step 1: Write the failing tests**

In `src/lib/form-core.test.ts` (add `writable` to the `svelte/store` import):

```ts
describe('hidden field validation', () => {
	it('excludes statically hidden fields from validation', async () => {
		const form = Base.newForm([
			{ type: 'input', name: 'email', schema: z.string().min(5), hide: true }
		] as never);

		await tick();
		expect(form.validate()).toBe(true);
	});

	it('tracks a data-dependent hide as the user types', async () => {
		const form = Base.newForm([
			{ type: 'input', name: 'other', schema: z.string().optional() },
			{
				type: 'input',
				name: 'email',
				schema: z.string().min(5),
				hide: (data: { other?: string }) => !data.other
			}
		] as never);
		const unsubscribe = form.isValid().subscribe(() => undefined);

		await tick();
		expect(form.validate()).toBe(true);

		form.getData().set({ other: 'x' } as never);
		await tick();
		expect(form.validate()).toBe(false);

		form.getData().set({ other: 'x', email: 'hello@example.com' } as never);
		await tick();
		expect(form.validate()).toBe(true);
		unsubscribe();
	});

	it('excludes an entire hidden object subtree', async () => {
		const form = Base.newForm([
			{
				type: 'object',
				name: 'address',
				hide: true,
				schema: z.object({ street: z.string().min(3) }),
				elements: [{ type: 'input', name: 'street', schema: z.string().min(3) }]
			}
		] as never);

		await tick();
		expect(form.validate()).toBe(true);
	});

	it('clears validity blockage when a store-driven hide activates', async () => {
		const hide = writable(false);
		const { target, form } = await mountForm([
			{ type: 'input', name: 'email', schema: z.string().min(5), hide }
		] as never);

		await setInput(target.querySelector('input')!, 'abc');
		expect(get(form.isValid())).toBe(false);

		hide.set(true);
		await tick();
		flushSync();
		expect(get(form.isValid())).toBe(true);
	});
});
```

- [ ] **Step 2: Verify red**

Run: `pnpm vitest run src/lib/form-core.test.ts`
Expected: all four FAIL — hidden fields still validate (`validate()`/`isValid()` return `false` where `true` is expected, and the dynamic test fails at its first assertion).

- [ ] **Step 3: Implement hidden wiring in instance.ts**

Add the import:

```ts
import { storeArrayToStore } from './utils/store.js';
```

Add fields:

```ts
	private readonly hiddenFlags: Readable<(boolean | undefined)[]>;
	private lastFlagsKey: string | undefined;
	private lastComposed: ZodObject | undefined;
```

In the constructor, after `this.schemaNodes = buildSchemaNodes(elements);`:

```ts
		const hiddenStores: Readable<boolean | undefined>[] = [];
		const collectHidden = (nodes: SchemaNode[]) => {
			for (const node of nodes) {
				hiddenStores.push(this.resolveField(node.hide));
				if (node.children) {
					collectHidden(node.children);
				}
			}
		};
		collectHidden(this.schemaNodes);
		this.hiddenFlags = storeArrayToStore(hiddenStores);
		this.validation = derived([this.data, this.hiddenFlags], ([$data, $flags]) => {
			const result = this.composeSchema($flags).safeParse($data);
			...unchanged issue-mapping...
		});
```

(`resolveField(false)` returns a store that resolves via microtask; an unresolved/`undefined` flag counts as visible, matching how `Object.svelte` renders. Hide stores are resolved once here, in the exact traversal order `composeSchema` consumes below.)

Replace `composeSchema` with the flags-aware, memoized version:

```ts
	private composeSchema(flags: readonly (boolean | undefined)[]): ZodObject {
		const key = flags.map((flag) => (flag ? '1' : '0')).join('');
		if (this.lastComposed && key === this.lastFlagsKey) {
			return this.lastComposed;
		}
		let index = 0;
		const build = (nodes: SchemaNode[]): ZodObject => {
			const shape: Record<string, ZodTypeAny> = {};
			for (const node of nodes) {
				const hidden = flags[index++] === true;
				if (node.children) {
					// Children flags are consumed even when the object is
					// hidden so the cursor stays aligned with the store order.
					const childSchema = build(node.children);
					if (!hidden) {
						shape[node.key] = node.schema ?? childSchema;
					}
				} else if (!hidden && node.schema) {
					shape[node.key] = node.schema;
				}
			}
			return zod.object(shape);
		};
		const composed = build(this.schemaNodes);
		this.lastFlagsKey = key;
		this.lastComposed = composed;
		return composed;
	}
```

`getValidationSchema()` becomes hidden-aware:

```ts
	/**
	 * The currently effective validation schema: object schemas compose from
	 * their children unless explicitly provided, and hidden fields are
	 * excluded while hidden.
	 */
	getValidationSchema(): ZodObject {
		return this.composeSchema(get(this.hiddenFlags));
	}
```

- [ ] **Step 4: Verify green**

Run: `pnpm test && pnpm check`
Expected: all pass, including the Task 4 derived-schema tests and the whole prior suite.

- [ ] **Step 5: Commit**

```bash
git add src/lib/instance.ts src/lib/form-core.test.ts
git commit -m "feat: exclude hidden fields from validation reactively"
```

---

### Task 6: Docs and CORE-REVIEW.md closure

**Files:**
- Modify: docs pages under `src/routes/reference/` (locate by grep), `CORE-REVIEW.md`

- [ ] **Step 1: Locate and update docs**

```bash
grep -rn "hide" src/routes/reference --include="*.md" -l
grep -rn "withDefaultParam\|getValidationSchema\|ObjectElement\|object" src/routes/reference/configuration -l
```

Update, following each page's existing format:
- Wherever `hide` is documented: hidden fields are excluded from validation while hidden (an async/unresolved hide counts as visible); their values stay in the data store and in `onSubmit`; `hide` inside an array's `element` definition is not consulted for validation; an explicit object schema is authoritative and is not filtered by hidden children.
- Object element page: `schema` is now optional — when omitted it is derived from the children; an explicit schema wins.
- Generator page: `withDefaultParam` accepts any value (e.g. `disabled: true`); new `withContainer(type, component)` registers structural containers without extending the element union.
- Instance page: `getValidationSchema` returns the currently effective schema (derived objects, hidden exclusions).

- [ ] **Step 2: Update CORE-REVIEW.md**

Mark the four section-5 bullets (hidden fields, `as never` casts, stringly `withDefaultParam`, duplicate schema authority) with `*Resolved (core-review-5 branch).*` suffixes, matching the style used for items 1-4.

- [ ] **Step 3: Run all gates**

```bash
pnpm test && pnpm check && pnpm lint
```

Expected: all pass.

- [ ] **Step 4: Commit**

```bash
git add src/routes/reference CORE-REVIEW.md
git commit -m "docs: document hidden-field validation, derived schemas, and container registration"
```
