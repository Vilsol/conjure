<script lang="ts">
	import Label from '$lib/common/Label.svelte';
	import Wrapper from '$lib/common/Wrapper.svelte';
	import type { BaseProps } from '../types.js';

	import type { TextareaElement } from './textarea.js';

	let { definition, form, prefix }: BaseProps<TextareaElement> = $props();

	const realParams = $derived(form.resolveParams(definition));
	const fieldName = $derived(prefix + definition.name);
	const errors = $derived(form.getErrors());

	const WrapperElement = $derived(definition.components?.wrapper || Wrapper);
</script>

<WrapperElement>
	{#if definition.label}
		{@const LabelElement = definition.components?.label || Label}
		<LabelElement>
			<label for={fieldName}>{definition.label}</label>
		</LabelElement>
	{/if}

	<textarea id={fieldName} name={fieldName} {...$realParams}></textarea>

	<span class="conjure-error">{$errors[fieldName]?.[0] || ''}</span>
</WrapperElement>
