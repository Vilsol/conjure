<script lang="ts">
  import { Base, Form } from '$lib';
  import * as zod from 'zod';

  const form = Base.newForm([
    {
      type: 'object',
      name: 'user',
      schema: zod.object({}),
      elements: [
        {
          type: 'input',
          name: 'name',
          label: 'Name',
          schema: zod.string()
        },
        {
          type: 'input',
          name: 'email',
          label: 'Email',
          schema: zod.string().email()
        }
      ]
    }
  ] as const);

  const data = form.getData();
</script>

<Form {form} />

<pre>{JSON.stringify($data, null, 4)}</pre>
