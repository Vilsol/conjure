<script lang="ts">
  import type { BaseElement } from '$lib/types';

  import type { FormGenerator, FormInstance } from './registry';

  export let form: FormInstance<FormGenerator, Readonly<BaseElement<string>[]>>;
  console.log({ form });
</script>

<div>
  {#each form.elements as element}
    <svelte:component this={form.generator.getComponent(element.type)} definition={element} {form} />
  {/each}
</div>

<pre>{JSON.stringify(form.elements, null, 4)}</pre>
