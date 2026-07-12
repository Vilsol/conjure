<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
		params?: Record<string, unknown>;
	}

	let { children, params }: Props = $props();
</script>

<div class="conjure-wrapper" {...params}>
	{@render children?.()}
</div>
