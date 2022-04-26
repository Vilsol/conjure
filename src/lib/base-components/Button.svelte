<script lang="ts">
  import type { FormGenerator, FormInstance } from '$lib';
  import type { BaseElement } from '$lib/types';

  import type { ButtonElement } from './button';

  export let definition: ButtonElement;
  export let form: FormInstance<FormGenerator, Readonly<BaseElement<string>[]>>;

  $: realParams = form.resolveParams(definition);
  $: realText = form.resolveField(definition.text);
</script>

<button on:click={definition.click} {...$realParams}>{$realText}</button>
