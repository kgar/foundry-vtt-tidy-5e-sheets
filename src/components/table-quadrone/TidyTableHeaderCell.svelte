<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import TidyTableToggleIcon from 'src/components/table-quadrone/TidyTableToggleIcon.svelte';
  import { getContext, type Snippet } from 'svelte';
  import type { ExpansionTrackerToggleProvider } from 'src/features/expand-collapse/ExpansionTracker.svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = {
    primary?: boolean;
    columnWidth?: string | null;
    hideUnder?: number;
    title?: string | null;
    children?: Snippet;
    class?: string;
  } & HTMLAttributes<HTMLElement>;

  let {
    primary = false,
    columnWidth = null,
    title = null,
    hideUnder,
    children,
    class: cssClass,
    ...rest
  }: Props = $props();

  let hideUnderClass = $derived(!!hideUnder ? `hide-under-${hideUnder}` : '');

  let toggleable = getContext<ExpansionTrackerToggleProvider>(
    CONSTANTS.SVELTE_CONTEXT.SECTION_EXPANSION_TOGGLE_PROVIDER,
  );
</script>

<div
  class="tidy-table-header-cell {cssClass} {hideUnderClass}"
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.TABLE_HEADER_CELL}
  class:primary
  style:--tidy-table-column-width={columnWidth}
  {title}
  {...rest}
>
  {#if primary && !!toggleable}
    <TidyTableToggleIcon expanded={toggleable().expanded} />
  {/if}
  {@render children?.()}
</div>
