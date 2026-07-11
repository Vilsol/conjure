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
  ] as const);
  
  const data = form.getData();
</script>

<Form {form} />

<pre>{JSON.stringify($data, null, 4)}</pre>
```
