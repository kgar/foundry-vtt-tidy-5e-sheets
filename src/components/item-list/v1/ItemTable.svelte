<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import ExpandableContainer from 'src/components/expandable/ExpandableContainer.svelte';
  import { declareLocation } from 'src/types/location-awareness.types';
  import { setContext, type Snippet } from 'svelte';
  import {
    ExpansionTracker,
    type ExpansionTrackerToggleProvider,
  } from 'src/features/expand-collapse/ExpansionTracker.svelte';

  interface Props {
    /**
     * A unique identifier for this table when viewed amongst other tables in the same logical grouping of tables, such as a tab.
     */
    key: string;
    /**
     * Denotes whether the table can be expanded and collapsed.
     */
    toggleable?: boolean;
    header?: Snippet;
    body?: Snippet;
    [key: string]: any;
  }

  let { key, toggleable = true, header, body, ...rest }: Props = $props();

  let { class: cssClass, ...attributes } = rest;

  declareLocation(CONSTANTS.LOCATION_SECTION, key);

  const sectionExpansionTracker = ExpansionTracker.getOrInit(
    CONSTANTS.SVELTE_CONTEXT.SECTION_EXPANSION_TRACKER,
  );
  const { tabId, location } = sectionExpansionTracker.getContextKeys();

  if (toggleable) {
    sectionExpansionTracker.register(key, tabId, location);

    setContext<ExpansionTrackerToggleProvider>(
      CONSTANTS.SVELTE_CONTEXT.SECTION_EXPANSION_TOGGLE_PROVIDER,
      () => {
        return {
          expanded,
          toggle: () => sectionExpansionTracker.toggle(key, tabId, location),
        };
      },
    );
  }

  let expanded = $derived(
    !toggleable || sectionExpansionTracker.isExpanded(key, tabId, location),
  );
</script>

<section
  class="item-table {cssClass ?? ''}"
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_TABLE}
  data-tidy-section-key={key}
  {...attributes}
>
  {@render header?.()}
  <ExpandableContainer {expanded}>
    <div class="item-table-body">
      {@render body?.()}
    </div>
  </ExpandableContainer>
</section>
