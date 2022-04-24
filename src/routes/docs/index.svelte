<script context="module" lang="ts">
  import { base } from '$app/paths';

  /** @type {import('./index).Load} */
  export async function load() {
    return {
      redirect: base + '/docs/getting-started/introduction',
      status: 302
    };
  }
</script>
