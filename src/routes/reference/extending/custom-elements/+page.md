---
title: Custom elements
---

## Switch

Here is a sample implementation of a switch element.

Inside a component the form's element types are erased, so read values from the data store with `getPath($data, fieldName)` — it resolves dot-separated paths, including nested object and array fields. When the data shape is statically known (e.g. in application code), `getPath` returns the field's actual type; `FieldPath` and `PathValue` are exported for building your own typed helpers.

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
