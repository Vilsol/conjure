<script lang="ts">
  import { ValidationMessage } from '@felte/reporter-svelte';
  import type { BaseElement, FormGenerator, FormInstance, Textarea } from '$lib';
  import Label from '$lib/common/Label.svelte';
  import Wrapper from '$lib/common/Wrapper.svelte';
  import { fromZod } from '$lib/zod';

  export let definition: Textarea;
  export let form: FormInstance<FormGenerator, Readonly<BaseElement<string>[]>>;

  $: realParams = form.resolveParams(definition);

  $: {
    console.log(fromZod(definition.schema));
    console.log(definition.params);
  }
</script>

<svelte:component this={definition.components?.wrapper || Wrapper}>
  {#if definition.label}
    <svelte:component this={definition.components?.label || Label}>
      <label for={definition.name}>{definition.label}</label>
    </svelte:component>
  {/if}

  <textarea name={definition.name} {...$realParams} />

  <ValidationMessage for={definition.name} let:messages={message}>
    <span>{message || ''}</span>
  </ValidationMessage>
</svelte:component>
