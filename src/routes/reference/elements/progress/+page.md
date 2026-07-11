---
title: Progress
---

## Attributes

The `progress` element inherits all the attributes of [`BaseElement`](../../configuration/base-element/)

In addition, it has the following attributes:

| Attribute | Required                              | Description                | Type                                                                                                                                                        | Example                                             |
|-----------|---------------------------------------|:---------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------|
| `value`   | <strong class="required">Yes</strong> | Value of the progress      | <code>[`Resolvable`](../../configuration/resolvable/)\<number\></code>                                                                                      | <CodeBlock lang="ts" code="0.5" />                  |
| `params`  | No                                    | Additional HTML attributes | <code>[`Resolvable`](../../configuration/resolvable/)<[`HTMLProgressElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLProgressElement)></code> | <CodeBlock lang="ts" code="{'{class: \'red\'}'}" /> |

## Example

```svelte live ln
<script lang="ts">
  import { Base, Form } from '$lib';

  const form = Base.newForm([
    {
      type: 'progress',
      value: 0.5,
    },
  ] as const);
</script>

<Form {form} />
```
