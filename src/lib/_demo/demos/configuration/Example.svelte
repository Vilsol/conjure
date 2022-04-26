<script lang="ts">
  import { Base, Form } from '$lib';
  import { get } from 'svelte/store';
  import * as zod from 'zod';

  const form = Base.newForm([
    {
      type: 'input',
      name: 'name',
      label: 'Name',
      schema: zod.string(),
      params: {
        placeholder: 'Name'
      }
    },
    {
      type: 'textarea',
      name: 'description',
      label: 'Description',
      schema: zod.string(),
      params: {
        placeholder: 'Description'
      }
    },
    {
      type: 'input',
      name: 'dob',
      label: 'Date of birth',
      schema: zod.string(),
      params: {
        type: 'date'
      }
    },
    {
      type: 'input',
      name: 'password',
      label: 'Password',
      schema: zod.string().min(16),
      params: {
        type: 'password',
        placeholder: 'Password'
      }
    },
    {
      type: 'input',
      name: 'level',
      label: 'Level',
      schema: zod.number().min(3).max(100),
      params: {
        type: 'number',
        placeholder: 'Level'
      }
    },
    {
      type: 'select',
      name: 'selection',
      label: 'Option',
      schema: zod.string(),
      hide: (data) => {
        return !('level' in data && typeof data.level === 'number' && data.level > 0);
      },
      options: async (data) => {
        let selections = 3;
        if ('level' in data && typeof data.level === 'number' && data.level > 0) {
          selections = data.level;
        }

        selections = Math.min(50, selections);

        return new Promise((resolve) => {
          resolve(
            Array(selections)
              .fill(0)
              .map((_, i) => ({
                label: 'I: ' + i,
                value: i
              }))
          );
        });
      }
    },
    {
      type: 'button',
      text: 'Set name to John',
      click: () =>
        data.set({
          ...get(data),
          name: 'John'
        }),
      params: {
        class: 'demo-button mr-1'
      }
    },
    {
      type: 'button',
      text: 'Set level to 10',
      click: () =>
        data.set({
          ...get(data),
          level: 10
        }),
      params: {
        class: 'demo-button'
      }
    }
  ] as const);

  const data = form.getData();
</script>

<Form {form} />

<pre>{JSON.stringify($data, null, 4)}</pre>
