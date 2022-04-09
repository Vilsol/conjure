<script lang="ts">
  import { base } from '$app/paths';
  import { page } from '$app/stores';

  const menu: {
    category: string;
    elements: {
      name: string;
      url: string;
    }[];
  }[] = [
    {
      category: 'Getting Started',
      elements: [
        {
          name: 'Installation',
          url: '/getting-started/installation'
        },
        {
          name: 'Example',
          url: '/getting-started/example'
        }
      ]
    },
    {
      category: 'Configuration',
      elements: [
        {
          name: 'Generator',
          url: ''
        },
        {
          name: 'Async',
          url: '/configuration/async'
        }
      ]
    },
    {
      category: 'Components',
      elements: [
        {
          name: 'Form',
          url: ''
        },
        {
          name: 'Wrapper',
          url: ''
        },
        {
          name: 'Label',
          url: ''
        }
      ]
    },
    {
      category: 'Elements',
      elements: [
        {
          name: 'Header',
          url: ''
        },
        {
          name: 'Input',
          url: ''
        },
        {
          name: 'Select',
          url: ''
        },
        {
          name: 'Textarea',
          url: ''
        },
        {
          name: 'Button',
          url: ''
        },
        {
          name: 'Meter',
          url: ''
        },
        {
          name: 'Progress',
          url: ''
        },
        {
          name: 'Fieldset',
          url: ''
        },
        {
          name: 'RadioGroup',
          url: ''
        }
      ]
    }
  ];

  const isCurrentURL = (routeId: string, path: string) => {
    return path.substring(1) === routeId;
  };
</script>

<div class="h-screen inset-0 w-[19.5rem] pb-10 px-8 overflow-y-auto">
  <nav id="nav" class="text-sm leading-6 relative">
    <ul>
      {#each menu as item}
        <li class="mt-12 lg:mt-8">
          <h5 class="mb-8 lg:mb-3 font-semibold text-slate-900 dark:text-slate-200">{item.category}</h5>
          <ul class="space-y-6 lg:space-y-2 border-l border-slate-100 dark:border-slate-800">
            {#each item.elements as element}
              <li>
                <a
                  class:inactive={!isCurrentURL($page.routeId, element.url)}
                  class:active={isCurrentURL($page.routeId, element.url)}
                  href={base + element.url}>{element.name}</a
                >
              </li>
            {/each}
          </ul>
        </li>
      {/each}
    </ul>
  </nav>
</div>

<style lang="postcss">
  .active {
    @apply block border-l pl-4 -ml-px text-orange-500 border-current font-semibold;
  }

  .inactive {
    @apply block border-l pl-4 -ml-px border-slate-600 hover:border-slate-500 text-slate-400 hover:text-slate-300;
  }
</style>
