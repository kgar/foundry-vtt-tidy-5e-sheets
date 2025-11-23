<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { isUserInteractable } from 'src/utils/element';
  import { getContext, type Snippet } from 'svelte';

  interface Props {
    children?: Snippet;
  }

  let { children }: Props = $props();

  let toggleable = getContext<() => { expanded: boolean; toggle: Function }>(
    CONSTANTS.SVELTE_CONTEXT.SECTION_EXPANSION_TOGGLE_PROVIDER,
  );

  function handleHeaderRowClick(ev: MouseEvent) {
    if (!toggleable) {
      return;
    }

    if (
      ev.target instanceof HTMLElement &&
      isUserInteractable(ev.target) &&
      ev.target.getAttribute(CONSTANTS.SHEET_PART_ATTRIBUTE) !==
        CONSTANTS.SHEET_PARTS.EXPANSION_TOGGLE
    ) {
      // Avoid eagerly toggling expansion when a contained interactable element is being clicked.
      return;
    }

    ev.stopPropagation();

    toggleable().toggle();
  }
</script>

<header
  class="item-table-header-row"
  class:toggleable={!!toggleable}
  onclick={handleHeaderRowClick}
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_TABLE_HEADER_ROW}
>
  {#if !!toggleable}
    <i
      class="expand-indicator fas fa-angle-right"
      class:expanded={toggleable().expanded}
      data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.EXPANSION_TOGGLE}
    ></i>
  {/if}
  {@render children?.()}
</header>

<style lang="less">
  .item-table-header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.25rem 0 0.125rem 0.375rem;
    line-height: 0.75rem;
    font-size: 0.75rem;
    background: var(--t5e-table-header-row-color);
    box-shadow: 0 0 0.1875rem inset var(--t5e-table-header-row-border-color);
    border-radius: 0.3125rem;

    &.toggleable {
      cursor: pointer;
    }

    .expand-indicator {
      margin-right: 0.325rem;
    }
  }
</style>
