---
title: Textarea
---

## Attributes

The `textarea` element inherits all the attributes of [`BaseInput`](../../configuration/base-input/)

In addition, it has the following attributes:

| Attribute | Required | Description                | Type                                                                                                                                                                                                                              | Example                                             |
|-----------|----------|:---------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------|
| `params`  | No       | Additional HTML attributes | <code class="demo">[`Resolvable`](../../configuration/resolvable/)<[`HTMLTextAreaElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement)></code> | <CodeBlock lang="ts" code="{'{class: \'red\'}'}" /> |

## Example

```svelte live ln
<script lang="ts">
  import { Base, Form } from '$lib';

  const form = Base.newForm([
    {
      type: 'textarea',
      name: 'hello',
    },
  ]);
  
  const data = form.getData();
</script>

<Form {form} />

<pre>{JSON.stringify($data, null, 4)}</pre>
```
