---
title: Input
---

## Attributes

The `input` element inherits all the attributes of [`BaseInput`](../../configuration/base-input/)

In addition, it has the following attributes:

| Attribute | Required | Description                | Type                                                                                                                                                  | Example                                             |
|-----------|----------|:---------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------|
| `params`  | No       | Additional HTML attributes | <code>[`Resolvable`](../../configuration/resolvable/)<[`HTMLInputElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement)></code> | <CodeBlock lang="ts" code="{'{class: \'red\'}'}" /> |

## Examples

### Text

```svelte live ln
<script lang="ts">
  import { Base, Form } from '$lib';

  const form = Base.newForm([
    {
      type: 'input',
      name: 'foo',
      label: 'Text'
    }
  ] as const);
  
  const data = form.getData();
</script>

<Form {form} />

<pre>{JSON.stringify($data, null, 4)}</pre>
```

### Checkbox

```svelte live ln
<script lang="ts">
  import { Base, Form } from '$lib';

  const form = Base.newForm([
    {
      type: 'input',
      name: 'foo',
      label: 'Checkbox',
      params: {
        type: 'checkbox'
      }
    }
  ] as const);
  
  const data = form.getData();
</script>

<Form {form} />

<pre>{JSON.stringify($data, null, 4)}</pre>
```

### Color

```svelte live ln
<script lang="ts">
  import { Base, Form } from '$lib';

  const form = Base.newForm([
    {
      type: 'input',
      name: 'foo',
      label: 'Color',
      params: {
        type: 'color'
      }
    }
  ] as const);
  
  const data = form.getData();
</script>

<Form {form} />

<pre>{JSON.stringify($data, null, 4)}</pre>
```

### Datetime

```svelte live ln
<script lang="ts">
  import { Base, Form } from '$lib';

  const form = Base.newForm([
    {
      type: 'input',
      name: 'foo',
      label: 'Datetime',
      params: {
        type: 'datetime-local'
      }
    }
  ] as const);
  
  const data = form.getData();
</script>

<Form {form} />

<pre>{JSON.stringify($data, null, 4)}</pre>
```

### Email

```svelte live ln
<script lang="ts">
  import { Base, Form } from '$lib';

  const form = Base.newForm([
    {
      type: 'input',
      name: 'foo',
      label: 'Email',
      params: {
        type: 'email'
      }
    }
  ] as const);
  
  const data = form.getData();
</script>

<Form {form} />

<pre>{JSON.stringify($data, null, 4)}</pre>
```

### File

```svelte live ln
<script lang="ts">
  import { Base, Form } from '$lib';

  const form = Base.newForm([
    {
      type: 'input',
      name: 'foo',
      label: 'File',
      params: {
        type: 'file'
      }
    }
  ] as const);
  
  const data = form.getData();
</script>

<Form {form} />

<pre>{JSON.stringify($data, null, 4)}</pre>
```

### Password

```svelte live ln
<script lang="ts">
  import { Base, Form } from '$lib';

  const form = Base.newForm([
    {
      type: 'input',
      name: 'foo',
      label: 'Password',
      params: {
        type: 'password'
      }
    }
  ] as const);
  
  const data = form.getData();
</script>

<Form {form} />

<pre>{JSON.stringify($data, null, 4)}</pre>
```

### Radio

```svelte live ln
<script lang="ts">
  import { Base, Form } from '$lib';

  const form = Base.newForm([
    {
      type: 'input',
      name: 'foo',
      label: 'A',
      params: {
        type: 'radio',
        value: 'a'
      }
    },
    {
      type: 'input',
      name: 'foo',
      label: 'B',
      params: {
        type: 'radio',
        value: 'b'
      }
    }
  ] as const);
  
  const data = form.getData();
</script>

<Form {form} />

<pre>{JSON.stringify($data, null, 4)}</pre>
```

### Range

```svelte live ln
<script lang="ts">
  import { Base, Form } from '$lib';

  const form = Base.newForm([
    {
      type: 'input',
      name: 'foo',
      label: 'Range',
      params: {
        type: 'range'
      }
    }
  ] as const);
  
  const data = form.getData();
</script>

<Form {form} />

<pre>{JSON.stringify($data, null, 4)}</pre>
```
