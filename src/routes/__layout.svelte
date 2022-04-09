<script lang="ts">
  import '../app.css';

  import Sidebar from '../lib/_demo/components/Sidebar.svelte';
</script>

<div class="flex flex-row overflow-hidden">
  <Sidebar />
  <div class="h-screen w-full overflow-y-auto">
    <slot />
  </div>
</div>
