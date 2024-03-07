<script lang="ts">
    import { CONSTANTS } from 'src/constants';
  import { writable } from 'svelte/store';

  export let primary: boolean = false;
  export let title: string | undefined = undefined;

  const isHovering = writable<boolean>(false);

  function mouseEnter(ev: MouseEvent) {
    isHovering.set(true);
  }

  function mouseLeave(ev: MouseEvent) {
    isHovering.set(false);
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="tidy-table-cell {$$restProps.class ?? ''}"
  class:primary
  {title}
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.TABLE_CELL}
  on:mouseenter={mouseEnter}
  on:mouseleave={mouseLeave}
  {...$$restProps.attributes}
>
  <slot {isHovering} />
</div>
