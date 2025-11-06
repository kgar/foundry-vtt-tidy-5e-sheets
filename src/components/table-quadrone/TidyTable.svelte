<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import ExpandableContainer from 'src/components/expandable/ExpandableContainer.svelte';
  import { declareLocation } from 'src/types/location-awareness.types';
  import { setContext, type Snippet } from 'svelte';
  import {
    ExpansionTracker,
    type ExpansionTrackerToggleProvider,
  } from 'src/features/expand-collapse/ExpansionTracker.svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { buildDataset } from 'src/utils/data';

  interface Props extends HTMLAttributes<HTMLElement> {
    key: string;
    toggleable?: boolean;
    dataset?: Record<string, string>;
    header?: Snippet<[boolean]>;
    body?: Snippet;
  }

  let {
    key,
    toggleable = true,
    header,
    body,
    dataset,
    ...rest
  }: Props = $props();

  let { class: cssClass, ...attributes } = rest;

  let datasetAttributes = $derived(buildDataset(dataset));

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
  class="tidy-table {cssClass ?? ''}"
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_TABLE}
  data-tidy-section-key={key}
  {...attributes}
  {...datasetAttributes}
>
  {@render header?.(expanded)}
  <ExpandableContainer {expanded} deferRendering>
    <div class="item-table-body">
      {@render body?.()}
    </div>
  </ExpandableContainer>
</section>
