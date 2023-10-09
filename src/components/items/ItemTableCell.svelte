<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { setContext } from 'svelte';
  import { writable } from 'svelte/store';

  export let baseWidth: string | undefined = undefined;
  export let primary: boolean = false;
  export let cssClass: string = '';
  export let title: string | undefined = undefined;

  const isHovering = writable<boolean>(false);
  setContext(CONSTANTS.CONTEXT_GRID_CELL_HOVER, isHovering);

  function mouseEnter(ev: MouseEvent) {
    isHovering.set(true);
  }

  function mouseLeave(ev: MouseEvent) {
    isHovering.set(false);
  }
</script>

<div
  class="item-table-cell {cssClass}"
  class:primary
  style:flex-basis={baseWidth}
  {title}
  on:mouseenter={mouseEnter}
  on:mouseleave={mouseLeave}
  role="gridcell"
  tabindex="0"
>
  <slot />
</div>

<style lang="scss">
  .item-table-cell {
    flex-grow: 0;
    flex-shrink: 0;
    font-size: 0.75rem;
    font-family: var(--t5ek-body-font-family);
    height: 1.5rem;
    color: var(--t5ek-secondary-color);
    overflow: hidden;
    display: flex;
    flex-direction: row;
    gap: 0.25rem;
    align-items: center;
    justify-content: center;

    &.primary {
      flex: 1 1 1px;
      align-items: stretch; // e.g., provide plenty of room to tap / click the primary item cell to show summary.
      justify-content: initial;
      color: var(--t5ek-primary-color);
    }

    // &:hover {
    //   :global(.item-use-button-image) {
    //     background-image: none;
    //   }
    //   :global(.item-use-button i) {
    //     display: initial;
    //   }
    // }

    &:not(.primary) {
      border-left: 0.0625rem solid var(--t5ek-faintest-color);
    }
  }
</style>
