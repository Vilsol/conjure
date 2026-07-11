---
title: Object
---

## Configuration

The `object` element inherits all the attributes of [`BaseElement`](../../configuration/base-element/)

In addition, it has the following attributes:

<div class="attribute-table">

| Attribute  | Required                              | Description             | Type                                                 | Example                                                                  |
|------------|---------------------------------------|:------------------------|------------------------------------------------------|--------------------------------------------------------------------------|
| `name`     | <strong class="required">Yes</strong> | Name of the field       | string                                               | <CodeBlock lang="ts" code="'user'" />                                    |
| `schema`   | <strong class="required">Yes</strong> | Validation schema       | ZodObject                                            | <CodeBlock lang="ts" code="{'zod.object({})'}" />                        |
| `elements` | <strong class="required">Yes</strong> | The sub-elements schema | [`BaseElement[]`](../../configuration/base-element/) | <CodeBlock lang="ts" code="{'[{type: \'header\', text: \'Hello\'}]'}" /> |

</div>

## Example

```svelte live ln
<script lang="ts">
  import { Base, Form } from '$lib';
  import * as zod from 'zod';

  const form = Base.newForm([
    {
      type: 'object',
      name: 'user',
      schema: zod.object({}),
      elements: [
        {
          type: 'input',
          name: 'name',
          label: 'Name',
          schema: zod.string()
        },
        {
          type: 'input',
          name: 'email',
          label: 'Email',
          schema: zod.string().email()
        }
      ]
    }
  ] as const);

  const data = form.getData();
</script>

<Form {form} />

<pre class="demo">{JSON.stringify($data, null, 4)}</pre>
```
