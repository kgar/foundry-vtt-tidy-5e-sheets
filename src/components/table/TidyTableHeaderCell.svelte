<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { ExpandCollapseService } from 'src/features/expand-collapse/ExpandCollapseService';
  import TidyTableToggleIcon from 'src/components/table/TidyTableToggleIcon.svelte';

  export let primary: boolean = false;
  export let baseWidth: string | null = null;
  export let title: string | null = null;

  const expandCollapseService = ExpandCollapseService.getService();
  $: expandState = expandCollapseService.state;
</script>

<div
  class="tidy-table-header-cell {$$restProps.class ?? ''}"
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.TABLE_HEADER_CELL}
  class:primary
  style:flex-basis={baseWidth}
  {title}
>
  {#if primary && $expandState.toggleable}
    <TidyTableToggleIcon expanded={$expandState.expanded} />
  {/if}
  <slot />
</div>
