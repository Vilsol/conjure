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
| `schema`   | No                                    | Validation schema       | ZodObject                                            | <CodeBlock lang="ts" code="{'zod.object({})'}" />                        |
| `elements` | <strong class="required">Yes</strong> | The sub-elements schema | [`BaseElement[]`](../../configuration/base-element/) | <CodeBlock lang="ts" code="{'[{type: \'header\', text: \'Hello\'}]'}" /> |

</div>

When `schema` is omitted, the object's validation schema is derived recursively from its `elements`' own schemas instead — so nested objects don't need to duplicate their children's schemas by hand. Providing an explicit `schema` always wins, and it is authoritative: hidden children are not filtered out of an explicit schema the way they are from a derived one.

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
