<script lang="ts">
	import type { BaseElement, BaseProps, ObjectElement } from '../types.js';

	import { storeArrayToStore } from '../utils/store.js';

	let { definition, form, prefix }: BaseProps<ObjectElement<BaseElement<string>>> = $props();

	const hideElements = $derived(storeArrayToStore(definition.elements.map((e) => form.resolveField(e.hide ?? false))));
	const childPrefix = $derived(prefix + (definition.name ? definition.name + '.' : ''));
</script>

{#each definition.elements as element, i (i)}
	{#if !$hideElements[i]}
		{@const SvelteComponent = form.generator.getComponent(element.type)}
		<SvelteComponent definition={element} prefix={childPrefix} {form} />
	{/if}
{/each}
