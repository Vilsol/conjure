---
title: Setup
---

Setup instructions for conjure

<div class="stepper">
  <div class="stepper-header">
    <div class="stepper-number">1</div>
    <div>Step 1</div>
  </div>
  <div class="stepper-step">
    <div>Install <code>conjure-svelte</code> and <code>zod</code> via your favorite package manager.</div>
    <div>

```shell
pnpm add -D conjure-svelte zod
```
  </div>
  </div>

  <div class="stepper-header">
    <div class="stepper-number">2</div>
    <div>Step 2</div>
  </div>
  <div class="stepper-step">
    <div>Import conjure and zod.</div>

```ts
import { Base, Form } from 'conjure-svelte';
import * as zod from 'zod';
```
  </div>

  <div class="stepper-header">
    <div class="stepper-number">3</div>
    <div>Step 3</div>
  </div>
  <div class="stepper-step">
    <div>Construct the form schema. Declare the elements <code>as const</code> so the form data is fully typed, and handle submission with <code>onSubmit</code> — it is only called when the data passes validation.</div>

```ts
const form = Base.newForm(
	[
		{
			type: 'input',
			name: 'email',
			label: 'Email',
			schema: zod.email()
		},
		{
			type: 'input',
			name: 'password',
			label: 'Password',
			schema: zod.string().min(16),
			params: { type: 'password' }
		}
	] as const,
	{
		onSubmit: (data) => {
			// data is typed: { email: string; password: string }
			console.log(data);
		}
	}
);
```
  </div>

  <div class="stepper-header">
    <div class="stepper-number">4</div>
    <div>Step 4</div>
  </div>
  <div class="stepper-step">
    <div>Use the constructed form.</div>
    <div>

```svelte
<Form {form} />
```

  </div>
  </div>

  <div class="stepper-header">
    <div class="stepper-number">5</div>
    <div>Step 5</div>
  </div>
  <div class="stepper-step">
    <div>Read the reactive form state wherever you need it — the data, validity, and errors are all Svelte stores.</div>
    <div>

```svelte
<script lang="ts">
	const data = form.getData();
	const valid = form.isValid();
</script>

<pre>{JSON.stringify($data, null, 2)}</pre>
{#if !$valid}
	<p>Please fix the errors above.</p>
{/if}
```

See the [form instance](/reference/configuration/instance/) reference for everything an instance exposes.

  </div>
  </div>
</div>
