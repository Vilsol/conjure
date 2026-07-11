<script lang="ts" module>
	const params: Record<string, unknown> = $state({
		class: 'conjure-wrapper'
	});

	export const setParam = (param: string, value: unknown) => {
		params[param] = value;
	};
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
	}

	let { children }: Props = $props();
</script>

<div {...params}>
	{@render children?.()}
</div>
