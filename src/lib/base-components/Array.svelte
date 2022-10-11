<script lang="ts">
  import type { FormGenerator, FormInstance } from '$lib';
  import type { ArrayElement, BaseElement } from '$lib/types';

  export let definition: ArrayElement<BaseElement<string>>;
  export let form: FormInstance<FormGenerator, Readonly<BaseElement<string>[]>>;
  export let prefix: string;

  $: realCount = form.resolveField(definition.count);
</script>

{#if $realCount}
  {#each Array($realCount) as _, i}
    <svelte:component
      this={form.generator.getComponent(definition.element.type)}
      definition={{ ...definition.element, name: '' }}
      prefix={prefix + definition.name + '.' + i.toString() + '.'}
      {form} />
  {/each}
{/if}
