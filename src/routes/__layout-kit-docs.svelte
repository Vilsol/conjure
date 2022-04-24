<script context="module" lang="ts">
  import { createKitDocsLoader } from '@svelteness/kit-docs';

  export const prerender = true;

  export const load = createKitDocsLoader({
    sidebar: {
      '/': null,
      '/docs': '/docs'
    }
  });
</script>

<script lang="ts">
  import '@svelteness/kit-docs/client/polyfills/index.js';
  import '@svelteness/kit-docs/client/styles/fonts.css';
  import '@svelteness/kit-docs/client/styles/vars.css';

  import '../app.css';

  import type { MarkdownMeta, NavbarConfig, ResolvedSidebarConfig } from '@svelteness/kit-docs';
  import { Button, KitDocsLayout, SocialLink } from '@svelteness/kit-docs';
  import { KitDocs, createSidebarContext } from '@svelteness/kit-docs';
  import SearchIcon from '~icons/ri/search-line';
  import { page } from '$app/stores';

  export let meta: MarkdownMeta = null;

  export let sidebar: ResolvedSidebarConfig = null;

  const { activeCategory } = createSidebarContext(sidebar);

  $: category = $activeCategory ? `${$activeCategory}: ` : '';
  $: title = meta ? `${category}${meta.title} | Conjure` : null;
  $: description = meta?.description;

  const navbar: NavbarConfig = {
    links: [{ title: 'Documentation', slug: '/docs', match: /\/docs/ }]
  };
</script>

<svelte:head>
  {#key $page.url.pathname}
    {#if title}
      <title>{title}</title>
      <meta property="og:title" content={title} />
      <meta name="twitter:title" content={title} />
    {/if}
    {#if description}
      <meta name="description" content={description} />
      <meta name="twitter:description" content={description} />
      <meta name="og:description" content={description} />
    {/if}
    {#if title && description}
      <meta property="og:url" content={`https://vilsol.github.io/conjure/${$page.url.pathname}`} />
      <meta property="og:site_name" content="Conjure" />
      <meta property="og:type" content="article" />
    {/if}
  {/key}
</svelte:head>

<KitDocs {meta}>
  <KitDocsLayout {navbar} {sidebar} search>
    <div slot="navbar-left">
      <div class="logo">
        <Button href="/docs">
          <div class="logo-content">
            <span>Conjure</span>
          </div>
        </Button>
      </div>
    </div>

    <div class="socials" slot="navbar-right-alt">
      <SocialLink type="gitHub" href="https://github.com/Vilsol/conjure" />
    </div>

    <div slot="search">
      <input type="text" placeholder="// TODO Search..." class="search hidden md:block" />
      <div class="search md:hidden">
        <SearchIcon />
      </div>
    </div>

    <slot />
  </KitDocsLayout>
</KitDocs>

<style lang="postcss">
  .logo-content > span {
    @apply tracking-wide font-medium text-2xl ml-1.5;
  }
</style>
