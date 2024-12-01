<script lang="ts">
  import { createBubbler } from 'svelte/legacy';

  const bubble = createBubbler();
  import { CONSTANTS } from 'src/constants';

  interface Props {
    hidden?: boolean;
    rowContainerClass?: string;
    rowClass?: string;
    rowContainerAttributes?: Record<string, unknown>;
    rowAttributes?: Record<string, unknown>;
    children?: import('svelte').Snippet;
    afterRow?: import('svelte').Snippet;
  }

  let {
    hidden = false,
    rowContainerClass = '',
    rowClass = '',
    rowContainerAttributes = {},
    rowAttributes = {},
    children,
    afterRow,
  }: Props = $props();
</script>

<div
  class="tidy-table-row-container {rowContainerClass ?? ''}"
  class:hidden
  aria-hidden={hidden}
  {...rowContainerAttributes}
>
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="tidy-table-row {rowClass ?? ''}"
    data-tidy-table-row
    data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.TABLE_ROW}
    {...rowAttributes}
    onmousedown={bubble('mousedown')}
    onmouseenter={bubble('mouseenter')}
    onmouseleave={bubble('mouseleave')}
    ondragstart={bubble('dragstart')}
  >
    {@render children?.()}
  </div>

  <!-- Consider an alternative: don't require content to be nested within this component in order to be associated visually with the target row. -->
  {@render afterRow?.()}
</div>
