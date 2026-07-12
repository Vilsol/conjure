---
title: BaseElement
---

The base for all elements used in the form generator.

## Attributes

| Attribute   | Required                              | Description                     | Type                  | Example                                           |
|-------------|---------------------------------------|:--------------------------------|-----------------------|---------------------------------------------------|
| `type`      | <strong class="required">Yes</strong> | The type name of the field      | `string`              | <CodeBlock lang="ts" code="'input'" />            |
| `component` | No                                    | Override the rendered component | `unknown`             | <CodeBlock lang="ts" code="CustomInputElement" /> |
| `hide`      | No                                    | Whether to hide this element    | `Resolvable<boolean>` | <CodeBlock lang="ts" code="false" />              |

## Hiding and validation

`hide` only controls rendering — a hidden element's value stays in the data store and is still included in `onSubmit` payloads. While an element is hidden, it is excluded from validation, so a hidden required field no longer blocks the form; while an unresolved [`Resolvable`](../resolvable/) `hide` is still resolving, the element counts as visible.

:::info[Async hide and validate()]
Synchronous hides (a literal or a plain function of the data) apply immediately. For asynchronous `hide` resolvables (a Promise or a store-backed function), a synchronous `validate()` called right after a programmatic `getData().set(...)` may still observe the previous hide state — the update resolves one microtask later.
:::
