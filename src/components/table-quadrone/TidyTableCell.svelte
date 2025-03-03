<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import type { Snippet } from 'svelte';

  interface Props {
    primary?: boolean;
    title?: string | undefined;
    columnWidth?: string | null;
    hideUnder?: number;
    children?: Snippet<[any]>;
    [key: string]: any;
  }

  let {
    primary = false,
    title = undefined,
    columnWidth = null,
    hideUnder,
    children,
    ...rest
  }: Props = $props();

  let hideUnderClass = $derived(!!hideUnder ? `hide-under-${hideUnder}` : '');

  let isHovering = $state(false);

  function mouseEnter(ev: MouseEvent) {
    isHovering = true;
  }

  function mouseLeave(ev: MouseEvent) {
    isHovering = false;
  }
</script>

<div
  class="tidy-table-cell {rest.class ?? ''} {hideUnderClass}"
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
