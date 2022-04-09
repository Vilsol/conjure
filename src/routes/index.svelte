<script context="module" lang="ts">
  import { base } from '$app/paths';

  /** @type {import('./index).Load} */
  export async function load() {
    return {
      redirect: base + '/getting-started/installation',
      status: 302
    };
  }
</script>
