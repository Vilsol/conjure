<script lang="ts">
  import { Base, Form } from '$lib';
  import { get, writable } from 'svelte/store';
  import * as zod from 'zod';

  const count = writable(1);

  const form = Base.newForm([
    {
      type: 'array',
      name: 'aliases',
      schema: zod.array(zod.boolean()),
      count,
      element: {
        type: 'input',
        label: 'Alias',
        schema: zod.boolean()
      }
    },
    {
      type: 'button',
      text: '+',
      click: () => count.set(get(count) + 1),
      params: {
        class: 'px-3 py-1 bg-green-700 text-white rounded mr-1'
      }
    },
    {
      type: 'button',
      text: '-',
      click: () => count.set(get(count) - 1),
      params: () => {
        const base = {
          class: 'px-3 py-1 bg-red-700 text-white rounded disabled:bg-neutral-600'
        };

        if (get(count) <= 0) {
          return { ...base, disabled: true };
        }

        return base;
      }
    }
  ] as const);

  const data = form.getData();
</script>

<Form {form} />

<pre>{JSON.stringify($data, null, 4)}</pre>
