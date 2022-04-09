<script lang="ts">
  import type { BaseElement } from '$lib/types';

  import type { FormGenerator, FormInstance } from './';
  import { storeArrayToStore } from './utils/store';

  export let form: FormInstance<FormGenerator, Readonly<BaseElement<string>[]>>;

  const formBind = form.createForm();

  const hideElements = storeArrayToStore(form.elements.map((e) => form.resolveField(e.hide)));
</script>

<form use:formBind>
  {#each form.elements as element, i}
    {#if !$hideElements[i]}
      <svelte:component this={form.generator.getComponent(element.type)} definition={element} {form} />
    {/if}
  {/each}
</form>
