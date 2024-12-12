<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { ExpandCollapseService } from 'src/features/expand-collapse/ExpandCollapseService.svelte';
  import { isUserInteractable } from 'src/utils/element';
  import type { Snippet } from 'svelte';

  interface Props {
    children?: Snippet;
  }

  let { children }: Props = $props();

  const expandCollapseService = ExpandCollapseService.getService();

  function handleHeaderRowClick(ev: MouseEvent) {
    if (!expandState?.toggleable) {
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

  let expandState = $derived(expandCollapseService.state);
</script>

<header
  class="tidy-table-header-row"
  class:toggleable={expandState?.toggleable}
  onclick={handleHeaderRowClick}
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.TABLE_HEADER_ROW}
>
  {@render children?.()}
</header>
