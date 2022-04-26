<script lang="ts">
  import { ValidationMessage } from '@felte/reporter-svelte';
  import type { FormGenerator, FormInstance } from '$lib';
  import Label from '$lib/common/Label.svelte';
  import Wrapper from '$lib/common/Wrapper.svelte';
  import type { BaseElement } from '$lib/types';

  import type { InputElement } from './input';

  export let definition: InputElement;
  export let form: FormInstance<FormGenerator, Readonly<BaseElement<string>[]>>;
  export let prefix: string;

  $: realParams = form.resolveParams(definition);
</script>

<svelte:component this={definition.components?.wrapper || Wrapper}>
  {#if definition.label}
    <svelte:component this={definition.components?.label || Label}>
      <label for={definition.name}>{definition.label}</label>
    </svelte:component>
  {/if}

  <input type={$realParams.type ?? 'text'} name={prefix + definition.name} {...$realParams} />

  <ValidationMessage for={definition.name} let:messages={message}>
    <span>{message || ''}</span>
  </ValidationMessage>
</svelte:component>
