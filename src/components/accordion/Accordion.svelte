<script context="module" lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { setContext } from 'svelte';
  import { writable, type Writable } from 'svelte/store';

  export interface AccordionCtxType {
    selected?: Writable<object>;
  }
</script>

<script lang="ts">
  export let multiple: boolean = false;

  $: setContext<AccordionCtxType>(CONSTANTS.SVELTE_CONTEXT.CTX, {
    selected: multiple ? undefined : writable(),
  });
</script>

{#key multiple}
  <div class={$$props.class}>
    <slot />
  </div>
{/key}
