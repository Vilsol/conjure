<script lang="ts">
	import Label from '$lib/common/Label.svelte';
	import Wrapper from '$lib/common/Wrapper.svelte';
	import type { BaseProps } from '../types.js';

	import type { SelectElement } from './select.js';

	let { definition, form, prefix }: BaseProps<SelectElement> = $props();

	const realParams = $derived(form.resolveParams(definition));
	const realOptions = $derived(form.resolveField(definition.options));
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

	<select id={fieldName} name={fieldName} {...$realParams}>
		{#if $realOptions}
			{#each $realOptions as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		{/if}
	</select>

	<span class="conjure-error">{$errors[fieldName]?.[0] || ''}</span>
</WrapperElement>
