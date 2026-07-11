<script lang="ts">
	import { ValidationMessage } from '@felte/reporter-svelte';
	import Label from '$lib/common/Label.svelte';
	import Wrapper from '$lib/common/Wrapper.svelte';
	import type { BaseProps } from '../types.js';

	import type { InputElement } from './input.js';

	let { definition, form, prefix }: BaseProps<InputElement> = $props();

	const realParams = $derived(form.resolveParams(definition));
	const fieldName = $derived(prefix + definition.name);

	const WrapperElement = $derived(definition.components?.wrapper || Wrapper);
</script>

<WrapperElement>
	{#if definition.label}
		{@const LabelElement = definition.components?.label || Label}
		<LabelElement>
			<label for={fieldName}>{definition.label}</label>
		</LabelElement>
	{/if}

	<input id={fieldName} name={fieldName} type={$realParams.type ?? 'text'} {...$realParams} />

	<ValidationMessage for={fieldName} let:messages={message}>
		<span>{message || ''}</span>
	</ValidationMessage>
</WrapperElement>
