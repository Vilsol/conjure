<script lang="ts">
  import type { FormGenerator, FormInstance } from '$lib';
  import type { BaseElement } from '$lib/types';

  import type { MeterElement } from './meter';

  export let definition: MeterElement;
  export let form: FormInstance<FormGenerator, Readonly<BaseElement<string>[]>>;

  $: realParams = form.resolveParams(definition);
  $: realValue = form.resolveField(definition.value);
</script>

<progress {...$realParams} value={$realValue} />
