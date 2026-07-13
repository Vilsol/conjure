---
title: Meter
---

## Attributes

The `meter` element inherits all the attributes of [`BaseElement`](../../configuration/base-element/)

In addition, it has the following attributes:

| Attribute | Required                              | Description                | Type                                                                                                                                                  | Example                                             |
|-----------|---------------------------------------|:---------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------|
| `value`   | <strong class="required">Yes</strong> | Value of the meter         | <code>[`Resolvable`](../../configuration/resolvable/)\<number\></code>                                                                                | <CodeBlock lang="ts" code="0.5" />                  |
| `params`  | No                                    | Additional HTML attributes | <code>[`Resolvable`](../../configuration/resolvable/)<[`HTMLMeterElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMeterElement)></code> | <CodeBlock lang="ts" code="{'{class: \'red\'}'}" /> |

## Example

```svelte live ln
<script lang="ts">
  import { Base, Form } from '$lib';

  const form = Base.newForm([
    {
      type: 'meter',
      value: 0.5,
    },
  ]);
</script>

<Form {form} />
```
