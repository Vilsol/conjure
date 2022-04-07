<script lang="ts">
  import type { BaseElement } from '$lib/types';
  import { createForm } from 'felte';

  import type { FormGenerator, FormInstance } from './';

  export let form: FormInstance<FormGenerator, Readonly<BaseElement<string>[]>>;

  const { form: formBind, data } = createForm({
    initialValues: {}, // TODO Initial values
    extend: form.getExtensions(),
    onSubmit: console.log // TODO Submit handling
  });

  form.setData(data);
</script>

<form use:formBind>
  {#each form.elements as element}
    <svelte:component this={form.generator.getComponent(element.type)} definition={element} {form} />
  {/each}
</form>
