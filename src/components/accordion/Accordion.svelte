<script module lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { setContext, type Snippet } from 'svelte';

  export interface AccordionCtxType {
    selected: string;
    multiple: boolean;
  }
</script>

<script lang="ts">
  interface Props {
    multiple?: boolean;
    children?: Snippet;
    [key: string]: any;
  }

  let { multiple = false, children, ...rest }: Props = $props();

  let selected = $state<string>('');

  // kgar-migration-task - check this, verify it in the docs, and if it works, then suppress the warning
  setContext<AccordionCtxType>(CONSTANTS.SVELTE_CONTEXT.ACCORDION_CONTEXT, {
    selected: selected,
    multiple: multiple,
  });
</script>

{#key multiple}
  <div class={rest.class}>
    {@render children?.()}
  </div>
{/key}
