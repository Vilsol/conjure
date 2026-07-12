---
title: Label
---

The `Label` component wraps the `<label>` of every built-in element that defines a `label` attribute. By default it renders a `<span class="conjure-label">` around the label element.

## Styling

Target the `conjure-label` class in your CSS, or set attributes on every label rendered by a generator's forms with `withCommonParam`:

```ts
import { Base } from 'conjure-svelte';

const MyBase = Base.withCommonParam('label', 'class', 'conjure-label text-sm font-medium');
```

Like every generator method it returns a new generator, so different generators can carry different label params.

## Replacing the label

To replace the label wrapper for a single element, pass your own component via `components.label` on the element definition — see [`BaseInput`](../../configuration/base-input/#Components). Your component receives the `<label>` element as its `children` snippet, and a `params` prop containing the generator's common label params, which it may honor or ignore.
