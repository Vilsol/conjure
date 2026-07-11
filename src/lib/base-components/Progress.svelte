<script lang="ts">
	import type { BaseProps } from '../types.js';

	import type { ProgressElement } from './progress.js';

	let { definition, form }: BaseProps<ProgressElement> = $props();

	let realParams = $derived(form.resolveParams(definition));
	let realValue = $derived(form.resolveField(definition.value));
</script>

<progress {...$realParams} value={$realValue}></progress>
