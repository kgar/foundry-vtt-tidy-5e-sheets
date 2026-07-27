<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import type { Snippet } from 'svelte';

  interface Props {
    primary?: boolean;
    title?: string | undefined;
    baseWidth?: string | null;
    children?: Snippet;
    [key: string]: any;
  }

  let {
    primary = false,
    title = undefined,
    baseWidth = null,
    children,
    ...rest
  }: Props = $props();
</script>

<div
  class="tidy-table-cell {rest.class ?? ''}"
  class:primary
  {title}
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.TABLE_CELL}
  style:flex-basis={baseWidth}
  {...rest.attributes}
>
  {@render children?.()}
</div>
