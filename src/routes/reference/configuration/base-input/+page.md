---
title: BaseInput
---

An extension of the BaseElement that should be used for all elements that handle data.

## Attributes

The `BaseInput` element inherits all the attributes of [`BaseElement`](../base-element/)

In addition, it has the following attributes:

| Attribute    | Required                              | Description                          | Type                        | Example                                     |
|--------------|---------------------------------------|:-------------------------------------|-----------------------------|---------------------------------------------|
| `name`       | <strong class="required">Yes</strong> | Name of the field                    | `string`                    | <CodeBlock lang="ts" code="'name'" />       |
| `schema`     | <strong class="required">Yes</strong> | Validation schema                    | `ZodTypeAny`                | <CodeBlock lang="ts" code="zod.string()" /> |
| `value`      | No                                    | Initial value of the field           | `unknown`                   | <CodeBlock lang="ts" code="'John'" />       |
| `label`      | No                                    | Label of the field                   | `string`                    | <CodeBlock lang="ts" code="'Name'" />       |
| `components` | No                                    | Override the components of the field | [_Components_](#Components) | <CodeBlock lang="ts" code="{'{ ... }'}" />  |

### Components

| Attribute | Required | Description                    | Type      | Example                  |
|-----------|----------|:-------------------------------|-----------|--------------------------|
| `wrapper` | No       | Override the wrapper component | `unknown` | `CustomWrapperComponent` |
| `label`   | No       | Override the label component   | `unknown` | `CustomLabelComponent`   |

## Default values

A field's initial value is resolved in order of precedence:

1. the `data` option of [`newForm`](../instance/#Options) — existing values for edit pages
2. the element's `value` attribute
3. a zod `.default()` on the schema — `z.string().default('anon')`

See [default values](../instance/#Default-values) on the form instance page for details.
