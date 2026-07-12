<script lang="ts">
	import Label from '$lib/common/Label.svelte';
	import Wrapper from '$lib/common/Wrapper.svelte';
	import { getPath } from '$lib/utils/path.js';
	import type { BaseProps } from '../types.js';

	import type { InputElement } from './input.js';

	let { definition, form, prefix }: BaseProps<InputElement> = $props();

	const realParams = $derived(form.resolveParams(definition));
	const fieldName = $derived(prefix + definition.name);
	const errors = $derived(form.getErrors());
	const data = $derived(form.getData());

	const type = $derived(($realParams.type as string | undefined) ?? 'text');

	const toText = (value: unknown): string =>
		typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' ? String(value) : '';

	// Svelte owns this control's value: it is rendered from the data store,
	// and data-conjure-managed tells syncControls to leave it alone.
	const valueAttrs = $derived.by((): Record<string, unknown> => {
		const value = getPath($data, fieldName);
		if (type === 'checkbox') {
			return { checked: !!value };
		}
		if (type === 'radio') {
			// Pin the DOM value ('on' is the platform default) so the transient
			// text-phase render before params resolve cannot clear it.
			const radioValue = $realParams.value ?? 'on';
			return {
				value: radioValue,
				checked: value !== undefined && value !== null && toText(value) === toText(radioValue)
			};
		}
		if (type === 'file') {
			return {};
		}
		return { value: toText(value) };
	});

	const WrapperElement = $derived(definition.components?.wrapper || Wrapper);
</script>

<WrapperElement params={form.generator.getCommonParams('wrapper')}>
	{#if definition.label}
		{@const LabelElement = definition.components?.label || Label}
		<LabelElement params={form.generator.getCommonParams('label')}>
			<label for={fieldName}>{definition.label}</label>
		</LabelElement>
	{/if}

	<input id={fieldName} name={fieldName} {type} {...$realParams} {...valueAttrs} data-conjure-managed />

	<span class="conjure-error">{$errors[fieldName]?.[0] || ''}</span>
</WrapperElement>
