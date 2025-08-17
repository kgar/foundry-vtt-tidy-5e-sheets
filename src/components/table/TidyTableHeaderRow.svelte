<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import type { ExpansionTrackerToggleProvider } from 'src/features/expand-collapse/ExpansionTracker.svelte';
  import { isUserInteractable } from 'src/utils/element';
  import { getContext, type Snippet } from 'svelte';
  import type { ClassValue } from 'svelte/elements';

  interface Props {
    children?: Snippet;
    class?: ClassValue;
  }

  let { children, class: cssClass }: Props = $props();

  let toggleable = getContext<ExpansionTrackerToggleProvider>(
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
  class={[`tidy-table-header-row`, cssClass]}
  class:toggleable={!!toggleable}
  onclick={handleHeaderRowClick}
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.TABLE_HEADER_ROW}
>
  {@render children?.()}
</header>
