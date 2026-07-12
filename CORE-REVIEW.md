# Core review — issues and suggestions

Review of the library core (`FormGenerator`, `FormInstance`, base components,
zod introspection, `Form.svelte`), 2026-07-12. Ordered by importance.

## 1. Module-level `$state` in `Wrapper`/`Label` is a footgun — RESOLVED (core-fixes branch)

`src/lib/common/Wrapper.svelte:2` and `src/lib/common/Label.svelte:2` hold
their params in module-scope `$state`, mutated via the exported `setParam`.

- **Global to the whole app.** Two forms (or two libraries both using conjure)
  can't have different wrapper classes — last `setParam` wins everywhere.
- **Leaks across requests under SSR.** Module state on the server is shared
  between all users; a `setParam` during one request changes markup rendered
  for another.

**Suggestion:** model wrapper/label params like `withDefaultParam` —
per-generator, immutable, flowing `generator → instance → component` via the
`form` prop the components already receive.

## 2. Validation is event-driven where it should be derived — RESOLVED (core-fixes branch)

Validation state has two sources of truth that can disagree:

- `allErrors` only updates when `validate()` runs, and `validate()` only runs
  from DOM `input`/`submit` events (`src/lib/instance.ts:171`).
- `isValid()` (`src/lib/instance.ts:250`) independently re-parses on *every*
  data change.

Consequences:

- A programmatic `form.getData().set(...)` updates `isValid` but leaves
  `getErrors()` stale until the next keystroke.
- Each keystroke parses the full schema at least twice (once in `validate()`,
  once per live `isValid` subscription).
- `getValidationSchema()` rebuilds the zod object on every call, and each
  `isValid()` call creates a new schema + derived store.

**Suggestion:** memoize the schema once in the constructor and make one
derived store the single validation source:

```ts
private readonly validation = derived(this.data, ($d) => this.schema.safeParse($d));
```

`isValid`, `getErrors`, and `validate()` become cheap views over it. One parse
per change, never stale, and `validate()` stops being a mutation.

## 3. Async resolvables have a lost-update race — RESOLVED (core-fixes branch)

In `resolveParams` (`src/lib/instance.ts:310`) and `resolveField`
(`src/lib/instance.ts:340`), a function resolvable does:

```ts
derived(this.data, ($data, set) => {
	void Promise.resolve(params($data)).then((resolved) => set(merge(resolved)));
});
```

Two quick data changes with a genuinely async resolvable can resolve
out of order, leaving stale params/value in the store permanently.

**Suggestion:** latest-wins guard — capture a monotonic token before the
await and only `set` if it's still current, or return a cleanup function
from the `derived` callback that flips a `cancelled` flag.

## 4. Imperative DOM sync fights Svelte — RESOLVED (core-fixes branch)

`syncControls` (`src/lib/instance.ts:62`) writes values back into the DOM
imperatively while Svelte components render around them. The spread-select
value-ownership bug (now special-cased via `selectOptions`) was one casualty;
more are waiting:

- **Radios are corrupted.** For a radio group `name="color"` with values
  `red`/`blue`, `getPath(data, 'color')` returns `"red"` (a string), so
  `syncControls` sets `el.value = "red"` on *every* radio in the group —
  overwriting the `blue` radio's value attribute. `coerceValue` handles
  checkboxes but has no radio branch either (a radio group needs `checked`
  toggled by value match, not `value` written).
- **Files aren't handled.** `el.value` yields the fakepath string; `el.files`
  is never read.

**Suggestion:** keep the action-based `createForm()` as the bring-your-own-
markup escape hatch, but migrate the built-in components to render their
value declaratively from the data store (`value={$field}`, `checked={...}`),
the way select already went. `syncControls` shrinks to supporting only
unmanaged hand-written controls; every migrated control class deletes a
special case instead of adding one.

## 5. Smaller issues

- **Hidden fields still validate.** `BaseElement.hide`
  (`src/lib/types.ts:23`) affects rendering only; `getValidationSchema`
  includes hidden elements, so a conditionally hidden required field makes
  the form permanently unsubmittable. Visibility should imply (or at least
  document) validation behavior.
- **`Core`'s `'array' as never` casts** (`src/lib/base.ts:27-28`): array and
  object are structural containers, not user-facing element types, but are
  forced through the same `withType` channel. A separate registry slot for
  container types would remove the casts and stop `getComponent` lying about
  what's registered.
- **`withDefaultParam` is stringly typed** (`src/lib/generator.ts:68`):
  `{ [key: string]: string }` can't express `disabled: true` or numeric
  params, even though `resolveParams` merges these into arbitrary `X`.
  `unknown` values would match reality.
- **Duplicate schema authority for objects.** `ObjectElement` requires its own
  `ZodObject` *and* child elements each carry schemas — the user keeps them in
  sync by hand. Deriving the object schema from the children would also fix
  `getValidationSchema` only looking at top-level `elements` (nested
  validation currently works only because the user duplicated the structure).
- **`el.valueAsNumber`** (`src/lib/instance.ts:50`) yields `NaN` for
  partially-typed input like `1e`, which lands in the data store; guard with
  `Number.isNaN`. *Update: unreachable in practice — browsers report `''` for
  invalid partial number input, which the existing empty-string guard covers.*

## Recurring theme

For each piece of state (validity, params, DOM value) the code currently has
two writers. The select fix, the validation staleness, and the radio
corruption are the same bug wearing different hats. One owner per state — the
data store — with everything else a derived view is the change that pays off
everywhere.

## Suggested sequencing

1. **#1 and #2** — small, self-contained wins.
2. **#3** — targeted bug fix.
3. **#4** — the real architectural decision; do it incrementally, one control
   type at a time (select is already done).
