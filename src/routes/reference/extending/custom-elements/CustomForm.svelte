<script lang="ts">
	import { Form } from '$lib';
	import { z } from 'zod';

	import { CustomGenerator } from './CustomGenerator.js';

	const form = CustomGenerator.newForm([
		{
			type: 'switch',
			name: 'value',
			label: 'Toggle me',
			schema: z.boolean()
		}
	] as const);

	const data = form.getData();
</script>

<Form {form} />

<pre class="demo">{JSON.stringify($data, null, 4)}</pre>
