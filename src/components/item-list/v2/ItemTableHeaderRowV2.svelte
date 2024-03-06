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
  class="tidy-table-header-row"
  class:toggleable={$expandState.toggleable}
  on:click={handleHeaderRowClick}
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.EXPANSION_TOGGLE}
>
  {#if $expandState.toggleable}
    <i
      class="expand-indicator fas fa-angle-right"
      class:expanded={$expandState.expanded}
    ></i>
  {/if}
  <slot />
</header>
