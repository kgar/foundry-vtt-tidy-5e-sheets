<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import type { Snippet } from 'svelte';

  interface Props {
    primary?: boolean;
    title?: string | undefined;
    columnWidth?: string | null;
    children?: Snippet<[any]>;
    [key: string]: any;
  }

  let {
    primary = false,
    title = undefined,
    columnWidth = null,
    children,
    ...rest
  }: Props = $props();

  let isHovering = $state(false);

  function mouseEnter(ev: MouseEvent) {
    isHovering = true;
  }

  function mouseLeave(ev: MouseEvent) {
    isHovering = false;
  }
</script>

<div
  class="tidy-table-cell {rest.class ?? ''}"
  class:primary
  {title}
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.TABLE_CELL}
  onmouseenter={mouseEnter}
  onmouseleave={mouseLeave}
  style:--tidy-table-column-width={columnWidth}
  {...rest.attributes}
>
  {@render children?.({ isHovering })}
</div>
