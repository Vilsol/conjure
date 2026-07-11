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
    <div>Construct the form schema</div>

```ts
const form = Base.newForm([
	{
		type: 'input',
		name: 'email',
		label: 'Email',
		schema: zod.string().email()
	},
	{
		type: 'input',
		name: 'password',
		label: 'Password',
		schema: zod.string().min(16)
	}
]);
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
</div>
