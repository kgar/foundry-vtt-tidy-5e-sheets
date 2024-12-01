<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { ExpandCollapseService } from 'src/features/expand-collapse/ExpandCollapseService';
  import TidyTableToggleIcon from 'src/components/table/TidyTableToggleIcon.svelte';
  import type { Snippet } from 'svelte';

  interface Props {
    primary?: boolean;
    baseWidth?: string | null;
    title?: string | null;
    children?: Snippet;
    [key: string]: any;
  }

  let {
    primary = false,
    baseWidth = null,
    title = null,
    children,
    ...rest
  }: Props = $props();

  const expandCollapseService = ExpandCollapseService.getService();
  let expandState = $derived(expandCollapseService.state);
</script>

<div
  class="tidy-table-header-cell {rest.class ?? ''}"
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.TABLE_HEADER_CELL}
  class:primary
  style:flex-basis={baseWidth}
  {title}
>
  {#if primary && $expandState.toggleable}
    <TidyTableToggleIcon expanded={$expandState.expanded} />
  {/if}
  {@render children?.()}
</div>
