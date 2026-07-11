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

### setParam

`setWrapperParam` sets an attribute on **all** wrappers globally — for example to replace the class:

```ts
import { setWrapperParam } from 'conjure-svelte';

setWrapperParam('class', 'conjure-wrapper my-form-row');
```

## Replacing the wrapper

To replace the wrapper for a single element, pass your own component via `components.wrapper` on the element definition — see [`BaseInput`](../../configuration/base-input/#Components). Your component receives the element's content as its `children` snippet:

```svelte
<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children?: Snippet } = $props();
</script>

<fieldset class="fancy">
	{@render children?.()}
</fieldset>
```
