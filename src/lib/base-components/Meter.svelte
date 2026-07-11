<script lang="ts">
	import type { BaseProps } from '../types.js';

	import type { MeterElement } from './meter.js';

	let { definition, form }: BaseProps<MeterElement> = $props();

	let realParams = $derived(form.resolveParams(definition));
	let realValue = $derived(form.resolveField(definition.value));
</script>

<meter {...$realParams} value={$realValue}></meter>
