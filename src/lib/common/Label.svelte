<script lang="ts" context="module">
  const params = {
    class: 'conjure-label'
  };
  export const setParam = (param: string, value: unknown) => {
    params[param] = value;
  };
</script>

<!-- svelte-ignore a11y-label-has-associated-control -->
<label {...params}>
  <slot />
</label>
