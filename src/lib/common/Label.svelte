<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
		params?: Record<string, unknown>;
	}

	let { children, params }: Props = $props();
</script>

<span class="conjure-label" {...params}>
	{@render children?.()}
</span>
