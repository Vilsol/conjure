<script lang="ts">
  import Form from '$lib/Form.svelte';
  import * as zod from 'zod';

  import { DemoBase } from '../lib/_demo/context';

  const form = DemoBase.newForm([
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
      schema: zod.string(),
      params: {
        type: 'password'
      }
    },
    {
      type: 'input',
      name: 'level',
      label: 'Level',
      schema: zod.number(),
      params: {
        type: 'number'
      }
    }
  ] as const);

  const data = form.getData();
  console.log(data);
</script>

<div class="w-1/5 px-4 py-2">
  <Form {form} />
</div>
