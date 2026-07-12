<script lang="ts">
	import Label from '$lib/common/Label.svelte';
	import Wrapper from '$lib/common/Wrapper.svelte';
	import { deepEqual } from '$lib/utils/equal.js';
	import { getPath } from '$lib/utils/path.js';
	import type { BaseProps } from '../types.js';

	import type { SelectElement } from './select.js';

	let { definition, form, prefix }: BaseProps<SelectElement> = $props();

	const realParams = $derived(form.resolveParams(definition));
	const realOptions = $derived(form.resolveField(definition.options));
	const fieldName = $derived(prefix + definition.name);
	const errors = $derived(form.getErrors());
	const data = $derived(form.getData());

	// Options are rendered with their index as the DOM value; the selection
	// is derived from the data store by structural equality so option values
	// can be arbitrary objects.
	const selectedValue = $derived.by(() => {
		const options = $realOptions;
		if (!options) {
			return undefined;
		}
		const value = getPath($data, fieldName);
		if ($realParams.multiple) {
			const values = Array.isArray(value) ? value : [];
			return options.flatMap((option, index) => (values.some((v) => deepEqual(v, option.value)) ? [index] : []));
		}
		const index = options.findIndex((option) => deepEqual(option.value, value));
		return index === -1 ? undefined : index;
	});

	const WrapperElement = $derived(definition.components?.wrapper || Wrapper);

	$effect(() => {
		const options = $realOptions;
		if (options) {
			form.registerSelectOptions(fieldName, options);
		}
		return () => form.unregisterSelectOptions(fieldName);
	});
</script>

<WrapperElement params={form.generator.getCommonParams('wrapper')}>
	{#if definition.label}
		{@const LabelElement = definition.components?.label || Label}
		<LabelElement params={form.generator.getCommonParams('label')}>
			<label for={fieldName}>{definition.label}</label>
		</LabelElement>
	{/if}

	<select id={fieldName} name={fieldName} {...$realParams} value={selectedValue} data-conjure-managed>
		{#if $realOptions}
			{#each $realOptions as option, index (option.value)}
				<option value={index}>{option.label}</option>
			{/each}
		{/if}
	</select>

	<span class="conjure-error">{$errors[fieldName]?.[0] || ''}</span>
</WrapperElement>
