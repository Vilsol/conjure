# Core Review Item 5 — Design

Resolves the remaining items from `CORE-REVIEW.md` section 5 plus three
cosmetic follow-ups from the core-fixes final review. Decisions confirmed
with the maintainer on 2026-07-12.

## Decisions

| Question | Decision |
|---|---|
| Hidden-field validation | Reactively excluded while hidden (standard conditional-form semantics) |
| Hidden-field data on submit | Values stay in the data store and in `onSubmit` payload |
| Object element schemas | Optional; derived from children when absent; explicit schema wins |
| Extras | Unify radio value-match logic; `getDefaultParams` copy; drop stale TODO |

## 1. Hidden fields excluded from validation (reactive)

`FormInstance`'s constructor walks the element tree once and builds a tree of
schema nodes — `(key, schema?, hidden: Readable<boolean>, children?)`:

- Each node's hidden store comes from `this.resolveField(element.hide ?? false)`,
  so literals, functions of form data, stores, and promises all work — the same
  mechanism `Object.svelte` uses for rendering.
- All hide stores are flattened into one `Readable<boolean[]>` via the existing
  `storeArrayToStore` util (`src/lib/utils/store.js`).
- The validation store becomes
  `derived([this.data, hiddenFlags], ([$data, $flags]) => composeSchema($flags).safeParse($data) …)`,
  where `composeSchema` memoizes its last result keyed by the flags array.

Semantics:

- An **undefined** hide state (async resolvable not yet settled) counts as
  **visible** — identical to rendering (`!$hideElements[i]`).
- A hidden **object** excludes its entire subtree.
- Hidden fields' errors disappear automatically (their keys leave the schema),
  so error spans clear on hide.
- `getValidationSchema()` is redefined to return the *currently effective*
  schema (hidden fields excluded). Documented behavior change.
- Scope limit: `hide` inside an **array's** `element` definition is not
  consulted for validation — arrays validate via their own `ZodArray` schema,
  as today. Documented.
- Data is never mutated by hiding; `onSubmit` receives whatever is in the
  store, including values of hidden fields. Documented.

## 2. Object schemas derived from children

- `ObjectElement.schema` becomes **optional** (`types.ts`).
- Schema composition: an object with an explicit schema uses it as-is
  (authoritative — hidden children are NOT filtered out of an explicit
  schema; documented); without one, the object's schema is composed
  recursively from its visible children.
- `ArrayElement.schema` stays required.
- `seedDefaults` already recurses without consulting object schemas — no
  change.

## 3. Generator cleanups

- **`withContainer(type: string, component)`** on `FormGenerator`: writes to
  the same type registry as `withType` but returns `FormGenerator<T>`
  unchanged, so container types never pollute the element union. `Core`
  (`src/lib/base.ts`) becomes
  `new FormGenerator().withContainer('array', Array).withContainer('object', Object)`
  — the `'array' as never` casts are removed. No second registry; `getComponent`
  is unchanged.
- **`withDefaultParam` value type widens `string` → `unknown`** (can express
  `disabled: true`, numbers). The `defaultParams` map and `getDefaultParams`
  return type widen to match, and `getDefaultParams` returns a defensive copy
  (matching `getCommonParams`). Non-breaking relaxations.

## 4. Extras

- Shared `toText` helper (new export under `src/lib/utils/`) becomes the one
  implementation of radio value matching — used by `Input.svelte`'s radio
  branch (including the `'on'` default) and `syncControls`' radio branch in
  `instance.ts`.
- The stale `// TODO Support various validators` comment on
  `getValidationSchema` is removed (it lives at the constructor composition
  site).

## Testing

Red-green TDD throughout:

- Hidden required field stops blocking submit when hidden: static `hide: true`,
  function-of-data hide that toggles as the user types, and store-based hide.
- Hidden object excludes its whole subtree from validation.
- Errors for a field clear when it becomes hidden.
- Nested object validation works with NO explicit object schema (derived);
  explicit schema still wins when provided.
- Non-string default param (`disabled: true`) reaches the DOM.
- Existing suite (117 tests) stays green — arrays/objects render via the
  container path unchanged; a type-level test pins that `new FormGenerator()`
  exposes no `array`/`object` in its element union.

## Breaking surface

None intended. Observable behavior changes: `getValidationSchema()` reflects
hidden state; hidden fields no longer block submit (the point of the change).
