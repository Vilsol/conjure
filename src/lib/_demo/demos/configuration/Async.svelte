<script lang="ts">
  import { Base, Form } from '$lib';
  import * as zod from 'zod';

  import { getClasses, getFeature, getFeatures } from '../../dnd';

  const form = Base.newForm([
    {
      type: 'select',
      name: 'class',
      label: 'Class',
      schema: zod.string(),
      options: async () => {
        return [
          {
            label: 'Select class...',
            value: ''
          },
          ...(await getClasses()).results.map((clazz) => {
            return {
              label: clazz.name,
              value: clazz.index
            };
          })
        ];
      }
    },
    {
      type: 'select',
      name: 'feature',
      label: 'Feature',
      schema: zod.string(),
      hide: (data) => {
        return !('class' in data && data.class);
      },
      options: async (data: { class?: string }) => {
        if (!('class' in data && data.class)) {
          return [];
        }

        return [
          {
            label: 'Select feature...',
            value: ''
          },
          ...(await getFeatures(data.class)).results.map((feature) => {
            return {
              label: feature.name,
              value: feature.index
            };
          })
        ];
      }
    }
  ] as const);

  const data = form.getData();

  $: featureData = getFeature($data.feature as string);
</script>

<Form {form} />

{#await featureData then feature}
  {#if feature}
    <div>
      <strong>Name: </strong>
      <span class="text-neutral-300">{feature.name}</span><br />
      <strong>Level: </strong>
      <span class="text-neutral-300">{feature.level}</span><br />
      {#each feature.desc as line}
        <p class="text-neutral-300">{line}</p>
      {/each}
    </div>
  {/if}
{/await}
