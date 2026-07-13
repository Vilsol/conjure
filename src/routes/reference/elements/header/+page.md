---
title: Header
---

A simple HTML header element

## Configuration

The `header` element inherits all the attributes of the base `Element`

In addition, it has the following attributes:

| Attribute | Required                              | Description                | Type                                                                          | Example                                             |
|-----------|---------------------------------------|:---------------------------|-------------------------------------------------------------------------------|-----------------------------------------------------|
| `text`    | <strong class="required">Yes</strong> | Text to render             | `string`                                                                      | <CodeBlock lang="ts" code="'Hello World'" />        |
| `size`    | No                                    | Size of text from 1 to 6   | `number`                                                                      | <CodeBlock lang="ts" code="4" />                    |
| `params`  | No                                    | Additional HTML attributes | [`HTMLElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement) | <CodeBlock lang="ts" code="{'{class: \'red\'}'}" /> |

## Example

```svelte live ln
<script lang="ts">
  import { Base, Form } from '$lib';

  const form = Base.newForm([
    {
      type: 'header',
      text: 'Sample Header at default h1 size'
    },
    {
      type: 'header',
      text: 'Another header at h4 size',
      size: 4,
      params: {
        class: 'text-orange-500'
      }
    }
  ]);
</script>

<Form {form} />
```
