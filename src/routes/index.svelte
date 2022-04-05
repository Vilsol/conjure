<script lang="ts">
  import Form from '$lib/Form.svelte';
  import * as zod from 'zod';

  import { DemoBase } from '../lib/_demo/context';

  const form = DemoBase.newForm([
    {
      type: 'header',
      text: 'Sample Form'
    },
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
        type: 'password'
      }
    },
    {
      type: 'input',
      name: 'level',
      label: 'Level',
      schema: zod.number().min(3).max(100),
      params: {
        type: 'number'
      }
    },
    {
      type: 'select',
      name: 'selection',
      label: 'Option',
      schema: zod.string(),
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
    }
  ] as const);

  const data = form.getData();
  console.log(data);
</script>

<div class="w-1/5 px-4 py-2">
  <Form {form} />
</div>

<pre>{JSON.stringify($data, null, 4)}</pre>
