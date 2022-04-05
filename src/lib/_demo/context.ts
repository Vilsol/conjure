import { setParam as setWrapperParam } from '$lib/common/Wrapper.svelte';
import { Base } from '$lib/registry';

export const DemoBase = Base.withDefaultParam('input', 'class', 'demo-input')
  .withDefaultParam('select', 'class', 'demo-input')
  .withDefaultParam('textarea', 'class', 'demo-input');

setWrapperParam('class', 'my-3');
