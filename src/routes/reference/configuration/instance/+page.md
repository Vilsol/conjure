---
title: Form Instance
---

`FormInstance` is the reactive core of a form. It is created with `generator.newForm(elements, options?)`, holds the form data as a single store, validates it against the composed zod schema, and exposes everything the components (or your own code) need.

```ts
const form = Base.newForm(
	[
		{ type: 'input', name: 'email', label: 'Email', schema: z.email() }
	] as const,
	{
		data: { email: 'stored@example.com' },
		onSubmit: (data) => console.log(data)
	}
);
```

:::tip[Declare elements as const]
Passing the element array `as const` lets conjure infer the data type field-by-field from the zod schemas — `getData()`, `onSubmit`, and the `data` option all become fully typed. Without it, values fall back to broader types.
:::

## Options

| Option     | Required | Description                                                                                                | Type              |
|------------|----------|:-----------------------------------------------------------------------------------------------------------|-------------------|
| `data`     | No       | Existing values to edit. Deep-merged over the [default values](#Default-values), without being mutated.     | `DeepPartial<D>`  |
| `onSubmit` | No       | Called with the form data when the form is submitted and valid. Invalid submits reveal all errors instead. | `(data: D) => void` |

## Default values

When an instance is created, the data store is seeded in three layers, later layers winning:

1. A zod `.default()` on the element's schema — `z.string().default('anon')`
2. An explicit `value` on the element definition — see [`BaseInput`](../base-input/)
3. The `data` option — existing values for edit pages, merged deeply so missing fields keep their defaults

Seeding does not mark fields as touched, so an edit page with invalid stored values will not show errors until the user interacts or submits.

```svelte live ln
<script lang="ts">
  import { Base, Form } from '$lib';
  import { z } from 'zod';

  const form = Base.newForm(
    [
      {
        type: 'input',
        name: 'name',
        label: 'Name',
        schema: z.string().default('anon')
      },
      {
        type: 'input',
        name: 'email',
        label: 'Email',
        schema: z.email()
      }
    ] as const,
    {
      data: { email: 'stored@example.com' }
    }
  );

  const data = form.getData();
</script>

<Form {form} />

<pre>{JSON.stringify($data, null, 4)}</pre>
```

## Data

### getData

Returns the `Writable` store holding the form data. Reading it gives you the current values; writing to it updates the rendered controls.

```ts
const data = form.getData();
$data.email; // typed from the zod schema
```

Field names are dot-separated paths: an input named `address.street` lives at `$data.address.street`, and numeric segments create arrays.

## Validation

### getErrors

Returns a `Readable<Record<string, string[]>>` of validation messages keyed by field path, filtered to fields the user has touched. After a submit attempt every field counts as touched. The built-in elements render the first message of their field in a `<span class="conjure-error">`.

### getTouched

Returns a `Readable<Record<string, boolean>>` of the fields the user has interacted with. After a submit attempt the special `'*'` key is set, marking all fields as touched.

### isValid

Returns a `Readable<boolean>` that re-evaluates the composed schema on every data change — unlike `getErrors` it is not gated by touch, so it is correct from the very first render. Ideal for disabling a submit button.

```svelte live ln
<script lang="ts">
  import { Base, Form } from '$lib';
  import { z } from 'zod';

  const form = Base.newForm(
    [
      {
        type: 'input',
        name: 'email',
        label: 'Email',
        schema: z.email()
      }
    ] as const,
    {
      onSubmit: (data) => alert(JSON.stringify(data))
    }
  );

  const valid = form.isValid();
</script>

<Form {form} />

<p>Form is {$valid ? 'valid ✅' : 'invalid ❌'}</p>
```

### validate

Returns whether the current data is valid. Validation state is derived from the data store, so this is a plain read with no side effects — errors update automatically as the data changes. The instance uses it as the gate on submit; you rarely need to call it yourself.

### getValidationSchema

Returns the currently effective `ZodObject`, composed from the schemas of all named elements: [object schemas without an explicit `schema`](../../meta-elements/object/) are derived from their children, and elements that are currently [hidden](../../configuration/base-element/#Hiding-and-validation) are excluded.

## Advanced

### createForm

Returns the Svelte action that `<Form>` applies to its `<form>` element. Apply it yourself with `use:` if you render your own form markup — any control with a `name` attribute participates, as described in [custom elements](../../extending/custom-elements/).

### resolveParams / resolveField

Resolve an element's [`Resolvable`](../resolvable/) values into stores. `resolveParams` merges the generator's default params, attributes derived from the zod schema, and the element's own `params`, typed as the element's declared params type. Custom element components use these to stay reactive to form data.

### registerSelectOptions / unregisterSelectOptions

Used by select-like controls to register their currently resolved options so selections resolve back to the original option values — including plain objects. See [object values](../../elements/select/#Object-values) on the select page.
