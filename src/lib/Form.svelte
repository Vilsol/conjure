<script lang="ts">
  import { reporter } from '@felte/reporter-svelte';
  import { validator } from '@felte/validator-zod';
  import type { BaseElement } from '$lib/types';
  import { createForm } from 'felte';

  import type { FormGenerator, FormInstance } from './registry';

  export let form: FormInstance<FormGenerator, Readonly<BaseElement<string>[]>>;
  console.log({ form });

  const { form: formBind, data } = createForm({
    initialValues: {}, // TODO Initial values
    extend: [
      validator({
        schema: form.getValidationSchema()
      }),
      reporter
    ],
    onSubmit: console.log // TODO Submit handling
  });

  form.setData(data);
</script>

<form use:formBind>
  {#each form.elements as element}
    <svelte:component this={form.generator.getComponent(element.type)} definition={element} {form} />
  {/each}
</form>
