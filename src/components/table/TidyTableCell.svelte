<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { writable } from 'svelte/store';

  interface Props {
    primary?: boolean;
    title?: string | undefined;
    baseWidth?: string | null;
    children?: import('svelte').Snippet<[any]>;
    [key: string]: any;
  }

  let {
    primary = false,
    title = undefined,
    baseWidth = null,
    children,
    ...rest
  }: Props = $props();

  const isHovering = writable<boolean>(false);

  function mouseEnter(ev: MouseEvent) {
    isHovering.set(true);
  }

  function mouseLeave(ev: MouseEvent) {
    isHovering.set(false);
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
