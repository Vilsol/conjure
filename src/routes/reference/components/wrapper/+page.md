---
title: Wrapper
---

Every built-in element wraps its label, control, and error message in the `Wrapper` component — a `<div class="conjure-wrapper">` by default. It is the styling hook for laying out a form row.

## Styling

The default wrapper only carries the `conjure-wrapper` class:

```css
:global(.conjure-wrapper) {
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
}
```

### withCommonParam

`withCommonParam('wrapper', ...)` on the generator sets an attribute on the wrapper of every element rendered by forms from that generator — for example to replace the class:

```ts
import { Base } from 'conjure-svelte';

const MyBase = Base.withCommonParam('wrapper', 'class', 'my-form-row');
```

Like every generator method it returns a new generator, so different generators can carry different wrapper params.

## Replacing the wrapper

To replace the wrapper for a single element, pass your own component via `components.wrapper` on the element definition — see [`BaseInput`](../../configuration/base-input/#Components). Your component receives the element's content as its `children` snippet, and a `params` prop containing the generator's common wrapper params, which it may honor or ignore:

```svelte
<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children?: Snippet } = $props();
</script>

<fieldset class="fancy">
	{@render children?.()}
</fieldset>
```
