<script lang="ts" context="module">
  const params = {};
  export const setParam = (param: string, value: unknown) => {
    params[param] = value;
  };
</script>

<label {...params}>
  <slot />
</label>
