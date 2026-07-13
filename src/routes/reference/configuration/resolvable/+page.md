---
title: Resolvable
---

The `Resolvable<T>` type is a utility type that allows values to be specified in multiple ways. It can be:
- A direct value of type `T`
- A Promise that resolves to type `T`
- A function that takes form data and returns either `T` or a Promise of `T`
- A Svelte store that contains a value of type `T`

## Usage Examples

### Direct Value
```ts
{
  type: 'input',
  name: 'name',
  label: 'Name',
  schema: zod.string(),
  // Direct boolean value
  hide: false
}
```

### Promise
```ts
{
  type: 'select',
  name: 'class',
  label: 'Class',
  schema: zod.string(),
  // Promise that resolves to an array of options
  options: async () => [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' }
  ]
}
```

### Function
```ts
{
  type: 'select',
  name: 'feature',
  label: 'Feature',
  schema: zod.string(),
  // Function that returns boolean
  hide: (data) => !('class' in data && data.class)
}
```

### Svelte Store
```ts
const count = writable(1);

{
  type: 'array',
  name: 'aliases',
  schema: zod.array(zod.string()),
  // Svelte store containing a number
  count,
  element: {
    type: 'input',
    label: 'Alias',
    schema: zod.string()
  }
}
```

## Typing the data parameter

The `data` parameter of a resolvable function is typed as `{ [key: string]: unknown }` by default. TypeScript cannot infer it from the surrounding elements: the callback lives inside the same array the data type is derived from, and inference cannot feed an aggregate of the whole array back into one of its members (this is a compiler limitation, not a conjure one — see [microsoft/TypeScript#47599](https://github.com/microsoft/TypeScript/issues/47599)).

To get a typed `data`, declare the schema-bearing fields separately and annotate the callback with `ReMapper`:

```ts
import { Base, type ReMapper } from 'conjure-svelte';

const fields = [
	{
		type: 'input',
		name: 'stuff',
		label: 'Stuff',
		schema: zod.string()
	}
] as const;

type Data = ReMapper<typeof fields>;

const form = Base.newForm([
	...fields,
	{
		type: 'meter',
		// data is typed: { stuff: string }
		value: (data: Data) => Math.min(data.stuff.length / 10, 1)
	}
]);
```

The `as const` on the standalone `fields` array is required — outside of `newForm` there is nothing else to capture the literal element types.

## Common Use Cases

1. **Dynamic Visibility**: Using a function to determine if an element should be hidden based on form data
2. **Async Options**: Loading select options asynchronously from an API
3. **Reactive Counts**: Using a store to control the number of elements in an array
4. **Conditional Validation**: Applying validation rules based on other form values

## Best Practices

- Use direct values when the value is static and known at compile time
- Use functions when the value depends on other form data
- Use Promises when the value needs to be fetched asynchronously
- Use stores when the value needs to be reactive and updated from multiple places
