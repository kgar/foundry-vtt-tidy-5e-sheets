<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import type { Snippet } from 'svelte';
  import type { ClassValue, DragEventHandler, MouseEventHandler } from 'svelte/elements';

  interface Props {
    hidden?: boolean;
    rowContainerClass?: string;
    rowClass?: ClassValue;
    rowContainerAttributes?: Record<string, unknown>;
    rowAttributes?: Record<string, unknown>;
    children?: Snippet;
    afterRow?: Snippet;
    ondblclick?: MouseEventHandler<HTMLElement>;
    onmousedown?: MouseEventHandler<HTMLElement>;
    onmouseenter?: MouseEventHandler<HTMLElement>;
    onmouseleave?: MouseEventHandler<HTMLElement>;
    ondragstart?: DragEventHandler<HTMLElement>;
  }

  let {
    hidden = false,
    rowContainerClass = '',
    rowClass = '',
    rowContainerAttributes = {},
    rowAttributes = {},
    children,
    afterRow,
    ondblclick,
    onmousedown,
    onmouseenter,
    onmouseleave,
    ondragstart,
  }: Props = $props();
</script>

<div
  class="tidy-table-row-container {rowContainerClass ?? ''}"
  class:hidden
  aria-hidden={hidden}
  {...rowContainerAttributes}
>
  <div
    class={['tidy-table-row', rowClass]}
    data-tidy-table-row
    data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.TABLE_ROW}
    {...rowAttributes}
    {ondblclick}
    {onmousedown}
    {onmouseenter}
    {onmouseleave}
    {ondragstart}
  >
    {@render children?.()}
  </div>

  <!-- Consider an alternative: don't require content to be nested within this component in order to be associated visually with the target row. -->
  {@render afterRow?.()}
</div>
