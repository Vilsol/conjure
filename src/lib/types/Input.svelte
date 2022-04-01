<script lang="ts">
  import { ValidationMessage } from '@felte/reporter-svelte';
  import type { BaseElement, FormGenerator, FormInstance, Input } from '$lib';
  import Label from '$lib/common/Label.svelte';
  import Wrapper from '$lib/common/Wrapper.svelte';
  import { fromZod } from '$lib/zod';

  export let definition: Input;
  export let form: FormInstance<FormGenerator, Readonly<BaseElement<string>[]>>;

  let type = definition?.params?.type ?? 'text';
  $: {
    console.log(fromZod(definition.schema));
    console.log(definition.params);
  }

  $: realParams = {
    ...(form.generator.getDefaultParams('input') || {}),
    ...definition?.params
  } as unknown; // TODO Figure out how to avoid casting to unknown
</script>

<svelte:component this={definition.components?.wrapper || Wrapper}>
  {#if definition.label}
    <svelte:component this={definition.components?.label || Label}>
      <label for={definition.name}>{definition.label}</label>
    </svelte:component>
  {/if}

  <input {type} name={definition.name} {...realParams} />

  <ValidationMessage for={definition.name} let:messages={message}>
    <span>{message || ''}</span>
  </ValidationMessage>
</svelte:component>
