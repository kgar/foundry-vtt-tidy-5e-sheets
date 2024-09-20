<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { ExpandCollapseService } from 'src/features/expand-collapse/ExpandCollapseService';
  import { isUserInteractable } from 'src/utils/element';

  const expandCollapseService = ExpandCollapseService.getService();

  function handleHeaderRowClick(ev: MouseEvent) {
    if (!$expandState.toggleable) {
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

    expandCollapseService.toggle();
  }

  $: expandState = expandCollapseService.state;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<header
  class="item-table-header-row"
  class:toggleable={$expandState.toggleable}
  on:click={handleHeaderRowClick}
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_TABLE_HEADER_ROW}
>
  {#if $expandState.toggleable}
    <i
      class="expand-indicator fas fa-angle-right"
      class:expanded={$expandState.expanded}
      data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.EXPANSION_TOGGLE}
    ></i>
  {/if}
  <slot />
</header>

<style lang="scss">
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
