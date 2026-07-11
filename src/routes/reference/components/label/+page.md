---
title: Label
---

The `Label` component wraps the `<label>` of every built-in element that defines a `label` attribute. By default it renders a `<span class="conjure-label">` around the label element.

## Styling

Target the `conjure-label` class in your CSS, or set attributes on **all** labels globally with `setLabelParam`:

```ts
import { setLabelParam } from 'conjure-svelte';

setLabelParam('class', 'conjure-label text-sm font-medium');
```

## Replacing the label

To replace the label wrapper for a single element, pass your own component via `components.label` on the element definition — see [`BaseInput`](../../configuration/base-input/#Components). Your component receives the `<label>` element as its `children` snippet.
