<script lang="ts">
  import type { FormGenerator, FormInstance } from '$lib';
  import type { BaseElement, ObjectElement } from '$lib/types';

  import { storeArrayToStore } from '../utils/store';

  export let definition: ObjectElement<BaseElement<string>>;
  export let form: FormInstance<FormGenerator, Readonly<BaseElement<string>[]>>;
  export let prefix: string;

  const hideElements = storeArrayToStore(definition.elements.map((e) => form.resolveField(e.hide)));
</script>

{#each definition.elements as element, i}
  {#if !$hideElements[i]}
    <svelte:component
      this={form.generator.getComponent(element.type)}
      definition={element}
      prefix={prefix + definition.name + '.'}
      {form}
    />
  {/if}
{/each}
