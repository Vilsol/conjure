<script context="module" lang="ts">
  /** @type {import('./index).Load} */
  export async function load() {
    return {
      redirect: '/getting-started/installation',
      status: 302
    };
  }
</script>
