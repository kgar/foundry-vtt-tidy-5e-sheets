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

  let accordionContext = $state<AccordionCtxType>({
    selected: '',
    multiple: multiple,
  });

  setContext<AccordionCtxType>(
    CONSTANTS.SVELTE_CONTEXT.ACCORDION_CONTEXT,
    accordionContext,
  );
</script>

{#key multiple}
  <div class={rest.class}>
    {@render children?.()}
  </div>
{/key}
