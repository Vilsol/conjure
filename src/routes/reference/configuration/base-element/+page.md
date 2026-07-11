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
