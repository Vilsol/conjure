---
title: Form
---

The `<Form>` component renders a [form instance](../../configuration/instance/): it looks up the component for each element type in the generator, renders them in order, and applies the instance's form action to a `<form>` element so every control is bound to the data store.

## Props

| Prop   | Required                              | Description                  | Type           |
|--------|---------------------------------------|:-----------------------------|----------------|
| `form` | <strong class="required">Yes</strong> | The form instance to render | `FormInstance` |

## Behavior

- **Data binding** — any rendered control with a `name` attribute writes into the data store on `input`/`change`, and programmatic store updates are written back into the DOM.
- **Submission** — submitting the form prevents the default navigation, marks all fields as touched, validates, and calls the instance's `onSubmit` option only when the data is valid.
- **Hiding** — elements with a truthy [`hide`](../../configuration/base-element/) are not rendered; because `hide` is a [`Resolvable`](../../configuration/resolvable/), visibility can react to the form data itself.

## Example

```svelte live ln
<script lang="ts">
  import { Base, Form } from '$lib';
  import { z } from 'zod';

  const form = Base.newForm(
    [
      {
        type: 'input',
        name: 'name',
        label: 'Name',
        schema: z.string().min(2)
      },
      {
        type: 'input',
        name: 'newsletter',
        label: 'Subscribe?',
        schema: z.boolean().default(false),
        params: { type: 'checkbox' }
      },
      {
        type: 'input',
        name: 'email',
        label: 'Email',
        schema: z.email(),
        hide: (data) => !data.newsletter
      },
      {
        type: 'button',
        text: 'Submit',
        click: () => undefined,
        params: { type: 'submit' }
      }
    ] as const,
    {
      onSubmit: (data) => alert(JSON.stringify(data))
    }
  );
</script>

<Form {form} />
```

## Bring your own markup

`<Form>` is a thin convenience. If you need full control over the layout, apply the instance's action to your own `<form>` element — every named control inside participates automatically:

```svelte
<script lang="ts">
	const enhance = form.createForm();
</script>

<form use:enhance>
	<input name="email" />
	<button type="submit">Save</button>
</form>
```
