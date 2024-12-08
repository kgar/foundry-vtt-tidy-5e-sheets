<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import type { Snippet } from 'svelte';

  interface Props {
    primary?: boolean;
    title?: string | undefined;
    baseWidth?: string | null;
    children?: Snippet<[any]>;
    [key: string]: any;
  }

  let {
    primary = false,
    title = undefined,
    baseWidth = null,
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

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="tidy-table-cell {rest.class ?? ''}"
  class:primary
  {title}
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.TABLE_CELL}
  onmouseenter={mouseEnter}
  onmouseleave={mouseLeave}
  style:flex-basis={baseWidth}
  {...rest.attributes}
>
  {@render children?.({ isHovering })}
</div>
