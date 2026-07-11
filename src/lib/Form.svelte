<script lang="ts">
	import type { BaseElement } from './types.js';
	import * as zod from 'zod';

	import type { FormGenerator, FormInstance } from './index.js';
	import Object from './base-components/Object.svelte';

	interface Props {
		form: FormInstance<FormGenerator<BaseElement<string>>, Readonly<BaseElement<string>[]>>;
	}

	let { form }: Props = $props();

	const formBind = $derived(form.createForm());
</script>

<form use:formBind>
	<Object
		definition={{
			type: 'object',
			schema: zod.object({}),
			elements: form.elements,
			name: ''
		}}
		{form}
		prefix=""
	/>
</form>
