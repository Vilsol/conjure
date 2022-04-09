<script lang="ts">
  import { Form } from '$lib';
  import { DemoBase } from '$lib/_demo/context';
  import * as zod from 'zod';

  const API_BASE = 'https://www.dnd5eapi.co/api';

  type ListResponse = {
    results: {
      name: string;
      index: string;
    }[];
  };

  type Feature = {
    name: string;
    level: number;
    desc: string;
  };

  let classesCache: ListResponse;

  let classFeatureCache: {
    [key: string]: ListResponse;
  } = {};

  let featureCache: { [key: string]: Feature } = {};

  const form = DemoBase.newForm([
    {
      type: 'select',
      name: 'class',
      label: 'Class',
      schema: zod.string(),
      options: async () => {
        if (!classesCache) {
          classesCache = await fetch(API_BASE + '/classes').then((data) => data.json());
        }

        return [
          {
            label: 'Select class...',
            value: ''
          },
          ...classesCache.results.map((clazz) => {
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
      label: 'Spell',
      schema: zod.string(),
      hide: (data) => {
        return !('class' in data && data.class);
      },
      options: async (data: { class?: string }) => {
        if (!('class' in data && data.class)) {
          return [];
        }

        if (!(data.class in classFeatureCache)) {
          classFeatureCache[data.class] = await fetch(API_BASE + '/classes/' + data.class + '/features').then((data) =>
            data.json()
          );
        }

        return [
          {
            label: 'Select feature...',
            value: ''
          },
          ...classFeatureCache[data.class].results.map((feature) => {
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

  const getFeature = async (data: { feature?: unknown }): Promise<Feature> => {
    const feature = data.feature as string;

    if (feature) {
      if (!(feature in featureCache)) {
        featureCache[feature] = await fetch(API_BASE + '/features/' + feature).then((data) => data.json());
      }

      return featureCache[feature];
    }

    return undefined;
  };

  $: featureData = getFeature($data);
</script>

<div class="w-1/5 py-2">
  <Form {form} />
</div>

{#await featureData then feature}
  {#if feature}
    <div>
      <strong>Name: </strong>
      {feature.name}<br />
      <strong>Level: </strong>
      {feature.level}<br />
      <strong>Description:</strong>
      {feature.desc}
    </div>
  {/if}
{/await}
