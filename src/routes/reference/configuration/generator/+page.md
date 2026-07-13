---
title: Generator
---

A `FormGenerator` maps element type names to the Svelte components that render them, along with optional per-type configuration. The generator is **immutable** — every `with*` method returns a new generator — so you can derive specialized generators from a shared base without affecting it.

Conjure ships a ready-made generator, `Base`, with all the [built-in elements](../../elements/input/) registered:

```ts
import { Base } from 'conjure-svelte';

const form = Base.newForm([...]);
```

## Methods

### withType

Registers an element type and returns a new generator that can render it.

```ts
const generator = new FormGenerator().withType<InputElement, StripName<HTMLInputAttributes>>(
	'input',
	Input,
	fromValidatorToParams
);
```

| Parameter       | Required                              | Description                                                                                                             |
|-----------------|---------------------------------------|:-------------------------------------------------------------------------------------------------------------------------|
| `type`          | <strong class="required">Yes</strong> | The type name used in element definitions                                                                               |
| `component`     | <strong class="required">Yes</strong> | The Svelte component rendering the element                                                                              |
| `fromValidator` | No                                    | Converts a field's zod schema into HTML attributes (e.g. `z.string().min(2)` → `minlength="2"`). See [custom elements](../../extending/custom-elements/). |

The type parameter accumulates: `new FormGenerator().withType<A>(…).withType<B>(…)` produces a `FormGenerator<A | B>`, and `newForm` only accepts elements of the registered types.

### withDefaultParam

Sets a default HTML attribute for every element of a type. Element-level `params` override defaults. `value` accepts any value, not just strings — `disabled`, numeric params, etc. all work.

```ts
const generator = Base.withDefaultParam('input', 'placeholder', 'Type here…');
const disabled = Base.withDefaultParam('input', 'disabled', true);
```

### withContainer

Registers a structural container component (`array` or `object`) without extending the generator's element type union — containers aren't user-facing element types, so `newForm` doesn't need to know about them. Registering the same `type` again overwrites the previous registration, including any `fromValidator` converter it carried.

```ts
const generator = new FormGenerator().withContainer('array', Array).withContainer('object', Object);
```

`Base` is built with `withContainer` for its `array` and `object` support.

### withCommonParam

Sets an attribute on the built-in [`Wrapper`](../../components/wrapper/) or [`Label`](../../components/label/) rendered by every element created from forms of this generator.

```ts
const generator = Base.withCommonParam('wrapper', 'class', 'my-form-row');
```

### newForm

Creates a [form instance](../instance/) from an array of element definitions and optional [options](../instance/#Options).

```ts
const form = generator.newForm(elements, { onSubmit });
```

### getComponent / getFromValidator / getDefaultParams / getCommonParams

Lookups used by the rendering components; you normally only need these when [building custom element components](../../extending/custom-elements/).
