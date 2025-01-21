<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import TidyTableToggleIcon from 'src/components/table/TidyTableToggleIcon.svelte';
  import { getContext, type Snippet } from 'svelte';

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

  let toggleable =
    getContext<() => { expanded: boolean; toggle: Function }>('sectionToggle');
</script>

<div
  class="tidy-table-header-cell {rest.class ?? ''}"
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.TABLE_HEADER_CELL}
  class:primary
  style:flex-basis={baseWidth}
  {title}
>
  {#if primary && !!toggleable}
    <TidyTableToggleIcon expanded={toggleable().expanded} />
  {/if}
  {@render children?.()}
</div>
