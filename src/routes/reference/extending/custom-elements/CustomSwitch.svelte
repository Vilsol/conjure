<script lang="ts">
	import { getPath } from '$lib';
	import Label from '$lib/common/Label.svelte';
	import Wrapper from '$lib/common/Wrapper.svelte';
	import type { BaseProps } from '$lib/types.js';
	import type { SwitchElement } from './CustomGenerator.js';

	let { definition, form, prefix }: BaseProps<SwitchElement> = $props();

	const WrapperElement = $derived(definition.components?.wrapper || Wrapper);

	const realParams = $derived(form.resolveParams(definition));
	const fieldName = $derived(prefix + definition.name);
	const data = $derived(form.getData());
	const checked = $derived(!!getPath($data, fieldName));
	const disabled = $derived(!!$realParams.disabled);
</script>

<WrapperElement>
	{#if definition.label}
		{@const LabelElement = definition.components?.label || Label}
		<LabelElement>
			<label for={fieldName}>{definition.label}</label>
		</LabelElement>
	{/if}

	<input id={fieldName} type="checkbox" name={fieldName} {disabled} class="sr-only" />

	<label
		for={fieldName}
		class="relative inline-block w-14 h-7 my-2 {disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}"
	>
		<div
			class="absolute inset-0 bg-gray-300 transition-all duration-200 rounded-full {checked ? 'bg-green-500' : ''}"
		></div>
		<div
			class="absolute h-5 w-5 left-1 bottom-1 bg-white transition-all duration-200 rounded-full shadow-md {checked
				? 'translate-x-7'
				: ''}"
		></div>
	</label>
</WrapperElement>
