<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import TidyTableToggleIcon from 'src/components/table-quadrone/TidyTableToggleIcon.svelte';
  import { getContext, type Snippet } from 'svelte';
  import type { ExpansionTrackerToggleProvider } from 'src/features/expand-collapse/ExpansionTracker.svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = {
    primary?: boolean;
    baseWidth?: string | null;
    title?: string | null;
    children?: Snippet;
    class?: string;
  } & HTMLAttributes<HTMLElement>;

  let {
    primary = false,
    baseWidth = null,
    title = null,
    children,
    class: cssClass,
    ...rest
  }: Props = $props();

  let toggleable = getContext<ExpansionTrackerToggleProvider>(
    CONSTANTS.SVELTE_CONTEXT.SECTION_EXPANSION_TOGGLE_PROVIDER,
  );
</script>

<div
  class="tidy-table-header-cell {cssClass}"
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.TABLE_HEADER_CELL}
  class:primary
  style:flex-basis={baseWidth}
  {title}
  {...rest}
>
  {#if primary && !!toggleable}
    <TidyTableToggleIcon expanded={toggleable().expanded} />
  {/if}
  {@render children?.()}
</div>
