<script lang="ts">
  import type { BaseElement } from '$lib/types';
  import * as zod from 'zod';

  import type { FormGenerator, FormInstance } from './';
  import Object from './base-components/Object.svelte';

  export let form: FormInstance<FormGenerator, Readonly<BaseElement<string>[]>>;

  const formBind = form.createForm();
</script>

<form use:formBind>
  <Object
    definition={{
      type: 'object',
      schema: zod.object({}),
      elements: form.elements,
      name: ''
    }}
    {form}
    prefix=""
  />
</form>
