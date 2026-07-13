---
title: Select
---

## Attributes

The `select` element inherits all the attributes of [`BaseInput`](../../configuration/base-input/)

In addition, it has the following attributes:

| Attribute | Required                              | Description                | Type                                                                                                                                                    | Example                                             |
|-----------|---------------------------------------|:---------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------|
| `options` | <strong class="required">Yes</strong> | List of options            | <code>[`Resolvable`](../../configuration/resolvable/)<[`SelectOption`](#SelectOption)[]></code>                                                         | <CodeBlock lang="ts" code="[ ... ]" />              |
| `params`  | No                                    | Additional HTML attributes | <code>[`Resolvable`](../../configuration/resolvable/)<[`HTMLSelectElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement)></code> | <CodeBlock lang="ts" code="{'{class: \'red\'}'}" /> |

### SelectOption

| Attribute | Required                              | Description         | Type    | Example                               |
|-----------|---------------------------------------|:--------------------|---------|---------------------------------------|
| `label`   | <strong class="required">Yes</strong> | Label of the option | `string`  | <CodeBlock lang="ts" code="'1234'" /> |
| `value`   | <strong class="required">Yes</strong> | Value of the option | `unknown` | <CodeBlock lang="ts" code="1234" />   |

## Example

```svelte live ln
<script lang="ts">
  import { Base, Form } from '$lib';

  const form = Base.newForm([
    {
      type: 'select',
      name: 'hello',
      options: [
        { label: 'Option 1', value: 1 },
        { label: 'Option 2', value: 2 },
        { label: 'Option 3', value: 3 },
      ],
    }
  ]);
  
  const data = form.getData();
</script>

<Form {form} />

<pre>{JSON.stringify($data, null, 4)}</pre>
```

## Object values

Option values are not limited to strings — selecting an option puts the **original** `value` into the form data, objects included. The selection is matched back by structural equality, so this also works with existing values on an edit page:

```svelte live ln
<script lang="ts">
  import { Base, Form } from '$lib';
  import { z } from 'zod';

  const colors = [
    { label: 'Red', value: { id: 1, hex: '#f00' } },
    { label: 'Blue', value: { id: 2, hex: '#00f' } }
  ];

  const form = Base.newForm(
    [
      {
        type: 'select',
        name: 'color',
        label: 'Color',
        schema: z.object({ id: z.number(), hex: z.string() }),
        options: colors
      }
    ],
    {
      data: { color: { id: 2, hex: '#00f' } }
    }
  );

  const data = form.getData();
</script>

<Form {form} />

<pre>{JSON.stringify($data, null, 4)}</pre>
```

Multiple selects (`params: { multiple: true }`) resolve to an array of option values.

:::info[How it works]
The rendered `<option>` elements carry the option **index** as their DOM value, and the component registers its resolved options on the form instance via `registerSelectOptions`. Custom select-like components can use the same mechanism — see the [form instance](../../configuration/instance/) reference.
:::
