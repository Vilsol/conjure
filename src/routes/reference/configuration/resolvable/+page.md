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
