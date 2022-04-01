<script lang="ts">
  import type { BaseElement, FormGenerator, FormInstance, Header } from '$lib';

  export let definition: Header;
  export let form: FormInstance<FormGenerator, Readonly<BaseElement<string>[]>>;

  $: realParams = {
    ...(form.generator.getDefaultParams('header') || {}),
    ...definition?.params
  } as unknown; // TODO Figure out how to avoid casting to unknown
</script>

{#if definition.size === 1 || definition.size === undefined}
  <h1 {...realParams}>{definition.text}</h1>
{:else if definition.size === 2}
  <h2 {...realParams}>{definition.text}</h2>
{:else if definition.size === 3}
  <h3 {...realParams}>{definition.text}</h3>
{:else if definition.size === 4}
  <h4 {...realParams}>{definition.text}</h4>
{:else if definition.size === 5}
  <h5 {...realParams}>{definition.text}</h5>
{:else if definition.size === 6}
  <h6 {...realParams}>{definition.text}</h6>
{/if}
