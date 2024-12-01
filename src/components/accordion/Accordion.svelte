<script module lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { setContext } from 'svelte';
  import { writable, type Writable } from 'svelte/store';

  export interface AccordionCtxType {
    selected?: Writable<object>;
  }
</script>

<script lang="ts">
  interface Props {
    multiple?: boolean;
    children?: import('svelte').Snippet;
    [key: string]: any;
  }

  let { multiple = false, children, ...rest }: Props = $props();

  $effect(() => {
    setContext<AccordionCtxType>(CONSTANTS.SVELTE_CONTEXT.ACCORDION_CONTEXT, {
      selected: multiple ? undefined : writable(),
    });
  });
</script>

{#key multiple}
  <div class={rest.class}>
    {@render children?.()}
  </div>
{/key}
