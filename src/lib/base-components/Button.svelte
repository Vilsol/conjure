<script lang="ts">
	import type { BaseProps } from '../types.js';

	import type { ButtonElement } from './button.js';

	let { definition, form }: BaseProps<ButtonElement> = $props();

	const realParams = $derived(form.resolveParams(definition));
	const realText = $derived(form.resolveField(definition.text));
</script>

<button type="button" onclick={definition.click} {...$realParams}>{$realText}</button>
