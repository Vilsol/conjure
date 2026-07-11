<script lang="ts">
	import type { ArrayElement, BaseElement, BaseProps } from '../types.js';

	let { definition, form, prefix }: BaseProps<ArrayElement<BaseElement<string>>> = $props();

	const realCount = $derived(form.resolveField(definition.count));
	const ItemComponent = $derived(form.generator.getComponent(definition.element.type));

	const itemDefinition = (index: number) =>
		({ ...definition.element, name: index.toString() }) as unknown as BaseElement<string>;
</script>

{#if $realCount}
	{#each Array.from({ length: $realCount }, (_, index) => index) as index (index)}
		<ItemComponent definition={itemDefinition(index)} prefix={prefix + definition.name + '.'} {form} />
	{/each}
{/if}
