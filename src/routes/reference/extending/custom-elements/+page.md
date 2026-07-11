---
title: Custom elements
---

## Switch

Here is a sample implementation of a switch element.

<script lang="ts">
  import { writable } from 'svelte/store';
  import CustomForm from './CustomForm.svelte';

  const state = writable(false);
</script>

<Tabs activeName="Output"> 
  <TabPanel name="Output"> 
    <div>
      <CustomForm />
    </div>
  </TabPanel>
  <TabPanel name="CustomSwitch.svelte"> 
<div>
<!-- Keep this empty -->

@code(./CustomSwitch.svelte)
</div>
  </TabPanel>
  <TabPanel name="CustomForm.svelte">
<div>
<!-- Keep this empty -->

@code(./CustomForm.svelte)
</div>
  </TabPanel>
  <TabPanel name="CustomGenerator.ts"> 
<div>
<!-- Keep this empty -->

@code(./CustomGenerator.ts)
</div>
  </TabPanel>
</Tabs>
