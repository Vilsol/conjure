---
title: Introduction
---

Conjure is a schema-driven form generator for Svelte 5. Instead of hand-writing markup, bindings, and validation wiring for every form, you describe the form as a plain array of element definitions and conjure renders it, validates it, and hands you the data — fully typed.

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
      },
      {
        type: 'input',
        name: 'age',
        label: 'Age',
        schema: z.coerce.number().min(18),
        params: { type: 'number' }
      }
    ] as const,
    {
      onSubmit: (data) => alert(JSON.stringify(data))
    }
  );

  const data = form.getData();
</script>

<Form {form} />

<pre>{JSON.stringify($data, null, 4)}</pre>
```

## Why a schema?

Because the form is data, you can do things that are awkward with hand-written forms:

- **Generate forms at runtime** — from an API response, a database table, a CMS definition.
- **Derive everything from one source of truth** — the zod schema on each field drives validation, error messages, and even HTML constraint attributes like `minlength` and `type="email"`.
- **Reuse and compose** — nest [objects](/reference/meta-elements/object/) and [arrays](/reference/meta-elements/array/), share element definitions between forms, or wrap common patterns in functions.
- **Stay type-safe** — declare the elements `as const` and the form data is inferred field-by-field from the zod schemas. `form.getData()` knows that `email` is a `string`.

## How it works

Three pieces cooperate:

1. A [generator](/reference/configuration/generator/) maps element type names (`'input'`, `'select'`, …) to Svelte components. The built-in `Base` generator covers the standard HTML controls, and you can [extend it](/reference/extending/custom-elements/) with your own types.
2. `generator.newForm(elements, options?)` creates a [form instance](/reference/configuration/instance/) — the reactive core holding the data, validation state, and submit handling.
3. The [`<Form>`](/reference/components/form/) component renders the elements and binds them to the instance.

Any form control with a `name` attribute participates automatically — including controls rendered by your own custom components. Dots in names write to nested paths, so an input named `address.street` produces `{ address: { street: '…' } }`.

## Design notes

- **zod is the only runtime dependency.** Conjure builds on `svelte/store`, so instances work in plain `.ts` modules too.
- **Errors show on touch.** Validation runs on every change, but a field's errors are only displayed once the user has interacted with it — or after a submit attempt, which reveals all of them.
- **Edit pages are first-class.** Pass existing values via the `data` option and they are merged over the schema defaults. See the [form instance](/reference/configuration/instance/) reference.

Ready to try it? Head to the [quick start](/guide/quick-start/).
