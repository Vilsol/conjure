---
title: Button
description: Button
---

## Attributes

The `button` element inherits all the attributes of [`BaseElement`](../../configuration/base-element/)

In addition, it has the following attributes:

| Attribute | Required                              | Description                   | Type                                                                                                                                                    | Example                                             |
|-----------|---------------------------------------|:------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------|
| `text`    | <strong class="required">Yes</strong> | Text to display on the button | <code>[`Resolvable`](../../configuration/resolvable/)\<string\></code>                                                                                  | <CodeBlock lang="ts" code="'Press Me'" />           |
| `click`   | <strong class="required">Yes</strong> | Function to execute on click  | <CodeBlock lang="ts" code="() => void" />                                                                                                               | <CodeBlock lang="ts" code="() => alert('Hello')" /> |
| `params`  | No                                    | Additional HTML attributes    | <code>[`Resolvable`](../../configuration/resolvable/)<[`HTMLButtonElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLButtonElement)></code> | <CodeBlock lang="ts" code="{'{class: \'red\'}'}" /> |

## Example

```svelte live ln
<script lang="ts">
  import { Base, Form } from '$lib';

  const form = Base.newForm([
    {
      type: 'button',
      text: 'Press Me',
      click: () => alert('Hello'),
    },
  ] as const);
</script>

<Form {form} />
```
