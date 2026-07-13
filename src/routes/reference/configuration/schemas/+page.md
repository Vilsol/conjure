---
title: Schemas
---

Every element `schema` accepts any validator implementing the [Standard Schema](https://standardschema.dev) specification — zod (v4+), valibot, ArkType, or a hand-rolled object. Field types are inferred from the schema's output type, and validation runs through the schema's `~standard.validate`.

```ts
import * as v from 'valibot';

const form = Base.newForm([
	{
		type: 'input',
		name: 'email',
		label: 'Email',
		schema: v.pipe(v.string(), v.email())
	}
]);

// data.email is typed string
const data = form.getData();
```

## Default values

An element's `value` seeds the initial form data, and is type-checked against the element's own schema:

```ts
{
	type: 'input',
	name: 'email',
	schema: zod.string(),
	value: 'me@example.com' // ✓
	// value: 42 — compile error: not assignable to the schema's input type
}
```

The check applies to top-level elements. Elements nested inside `object` or `array` containers are not checked.

## Zod-only conveniences

Standard Schema deliberately has no introspection, so two conveniences work only with zod schemas and degrade gracefully for other libraries:

- **HTML attribute derivation** — `zod.string().min(2).max(4)` renders `minlength`/`maxlength` attributes (and email/url/number types) on inputs. Non-zod schemas render without derived attributes; validation still applies.
- **Schema defaults** — `zod.string().default('x')` seeds initial data. For other libraries, set the element's `value` instead — it is the portable equivalent.

## Asynchronous validation

A schema whose `validate` returns a Promise is supported: the validation store updates when the promise resolves. Because validation is a derived store, asynchronous results only land while something is subscribed — the `Form` component always is, so this only matters when driving a form headlessly. `form.validate()` reads the current state and does not wait for in-flight validation.
