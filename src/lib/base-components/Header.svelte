<script lang="ts">
  import type { FormGenerator, FormInstance } from '$lib';
  import type { BaseElement } from '$lib/types';

  import type { HeaderElement } from './header';

  export let definition: HeaderElement;
  export let form: FormInstance<FormGenerator, Readonly<BaseElement<string>[]>>;

  $: realParams = form.resolveParams(definition);
</script>

{#if definition.size === 1 || definition.size === undefined}
  <h1 {...$realParams}>{definition.text}</h1>
{:else if definition.size === 2}
  <h2 {...$realParams}>{definition.text}</h2>
{:else if definition.size === 3}
  <h3 {...$realParams}>{definition.text}</h3>
{:else if definition.size === 4}
  <h4 {...$realParams}>{definition.text}</h4>
{:else if definition.size === 5}
  <h5 {...$realParams}>{definition.text}</h5>
{:else if definition.size === 6}
  <h6 {...$realParams}>{definition.text}</h6>
{/if}
