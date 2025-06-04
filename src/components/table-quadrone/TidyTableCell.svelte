<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import type { Snippet } from 'svelte';
  import type { ClassValue } from 'svelte/elements';

  interface Props {
    primary?: boolean;
    title?: string | undefined;
    columnWidth?: string | null;
    hideUnder?: number;
    children?: Snippet<[any]>;
    class?: ClassValue;
    [key: string]: any;
  }

  let {
    primary = false,
    title = undefined,
    columnWidth = null,
    hideUnder,
    class: cssClass,
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
  class={['tidy-table-cell', hideUnderClass, cssClass]}
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
