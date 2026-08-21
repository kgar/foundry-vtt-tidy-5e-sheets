<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import type { Snippet } from 'svelte';
  import type { ClassValue, HTMLAttributes } from 'svelte/elements';

  interface Props {
    primary?: boolean;
    title?: string | undefined;
    columnWidth?: string | null;
    hideUnder?: number;
    children?: Snippet;
    class?: ClassValue;
    attributes?: HTMLAttributes<HTMLElement>;
  }

  let {
    primary = false,
    title = undefined,
    columnWidth = null,
    hideUnder,
    class: cssClass,
    children,
    attributes,
  }: Props = $props();

  let hideUnderClass = $derived(!!hideUnder ? `hide-under-${hideUnder}` : '');
</script>

<div
  class={['tidy-table-cell', hideUnderClass, cssClass]}
  class:primary
  {title}
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.TABLE_CELL}
  style:--tidy-table-column-width={columnWidth}
  {...attributes}
>
  {@render children?.()}
</div>
