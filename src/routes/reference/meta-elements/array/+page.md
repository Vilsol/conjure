---
title: Array
---

## Configuration

The `array` element inherits all the attributes of [`BaseElement`](../../configuration/base-element/)

In addition, it has the following attributes:

<div class="attribute-table">

| Attribute  | Required                              | Description             | Type                                                    | Example                                                                |
|------------|---------------------------------------|:------------------------|---------------------------------------------------------|------------------------------------------------------------------------|
| `name`     | <strong class="required">Yes</strong> | Name of the field       | string                                                  | <CodeBlock lang="ts" code="'aliases'" />                               |
| `schema`   | <strong class="required">Yes</strong> | Validation schema       | ZodArray                                                | <CodeBlock lang="ts" code="zod.array(zod.string())" />                 |
| `element`  | <strong class="required">Yes</strong> | The sub-element schema  | Element                                                 | <CodeBlock lang="ts" code="{'{type: \'header\', text: \'Hello\'}'}" /> |
| `count`    | <strong class="required">Yes</strong> | Count of array elements | [`Resolvable<number>`](../../configuration/resolvable/) | <CodeBlock lang="ts" code="4" />                                       |

</div>

## Example

```svelte live ln
<script lang="ts">
  import { Base, Form } from '$lib';
  import { get, writable } from 'svelte/store';
  import * as zod from 'zod';

  const count = writable(1);

  const form = Base.newForm([
    {
      type: 'array',
      name: 'aliases',
      schema: zod.array(zod.string()),
      count,
      element: {
        type: 'input',
        label: 'Alias',
        schema: zod.string()
      }
    },
    {
      type: 'button',
      text: '+',
      click: () => count.set(get(count) + 1),
      params: {
        class: 'px-3 py-1 bg-green-700 text-white rounded mr-1'
      }
    },
    {
      type: 'button',
      text: '-',
      click: () => count.set(get(count) - 1),
      params: () => {
        const base = {
          class: 'px-3 py-1 bg-red-700 text-white rounded disabled:bg-neutral-600'
        };

        if (get(count) <= 0) {
          return { ...base, disabled: true };
        }

        return base;
      }
    }
  ] as const);

  const data = form.getData();
</script>

<div class="flex flex-col gap-4">
  <Form {form} />
  
  <pre class="demo">{JSON.stringify($data, null, 4)}</pre>
</div>
```
