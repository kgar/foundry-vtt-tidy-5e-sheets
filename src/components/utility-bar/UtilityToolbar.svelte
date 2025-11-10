<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import type { Snippet } from 'svelte';
  
  interface Props {
    children?: Snippet;
    [key: string]: any;
  }

  let { ...props }: Props = $props();
</script>

<section
  class="utility-toolbar {props.class ?? ''}"
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.UTILITY_TOOLBAR}
>
  {@render props.children?.()}
</section>

<style lang="less">
  .utility-toolbar {
    --vertical-padding-internal: 0.375rem;
    display: flex;
    gap: 0.5rem;
    align-items: center;
    border-bottom: 0.0625rem solid var(--t5e-separator-color);
    margin-bottom: var(--utility-toolbar-margin-bottom, 0.25rem);
    margin-left: var(--utility-toolbar-margin-left, -1rem);
    margin-right: var(--utility-toolbar-margin-right, -0.25rem);
    margin-top: var(
      --utility-toolbar-margin-top,
      calc(
        var(--vertical-padding-internal) - var(
            --t5e-classic-tab-contents-padding-top
          )
      )
    );
    padding-bottom: var(--vertical-padding-internal);
    padding-left: var(--utility-toolbar-padding-left, 1rem);
    padding-right: var(--utility-toolbar-padding-right, 1.75rem);
  }
</style>
