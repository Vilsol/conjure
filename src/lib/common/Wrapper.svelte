<script lang="ts" context="module">
  const params = {
    class: 'conjure-wrapper'
  };
  export const setParam = (param: string, value: unknown) => {
    params[param] = value;
  };
</script>

<div {...params}>
  <slot />
</div>
