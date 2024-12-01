<script lang="ts">
  import { run } from 'svelte/legacy';

  import { CONSTANTS } from 'src/constants';
  import ExpandableContainer from 'src/components/expandable/ExpandableContainer.svelte';
  import { ExpandCollapseService } from 'src/features/expand-collapse/ExpandCollapseService';
  import { declareLocation } from 'src/types/location-awareness.types';
  import { getContext } from 'svelte';
  import type { MessageBus } from 'src/types/types';

  interface Props {
    /**
     * A unique identifier for this table when viewed amongst other tables in the same logical grouping of tables, such as a tab.
     */
    key: string;
    /**
     * Denotes whether the table can be expanded and collapsed.
     */
    toggleable?: boolean;
    header?: import('svelte').Snippet;
    body?: import('svelte').Snippet;
    [key: string]: any;
  }

  let { key, toggleable = true, header, body, ...rest }: Props = $props();

  let { class: cssClass, ...attributes } = rest;

  const messageBus = getContext<MessageBus>(
    CONSTANTS.SVELTE_CONTEXT.MESSAGE_BUS,
  );
  const tabId = getContext<string | undefined>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);
  declareLocation('item-table', key);

  const expandCollapseService = ExpandCollapseService.initService(toggleable);

  let expandedState = $derived(expandCollapseService.state);

  run(() => {
    if (
      $messageBus?.tabId === tabId &&
      $messageBus?.message === CONSTANTS.MESSAGE_BUS_EXPAND_ALL
    ) {
      expandCollapseService.set(true);
    }
    if (
      $messageBus?.tabId === tabId &&
      $messageBus?.message === CONSTANTS.MESSAGE_BUS_COLLAPSE_ALL
    ) {
      expandCollapseService.set(false);
    }
  });
</script>

<section
  class="item-table {cssClass ?? ''}"
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_TABLE}
  data-tidy-section-key={key}
  {...attributes}
>
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  {@render header?.()}
  <ExpandableContainer expanded={$expandedState.expanded}>
    <div class="item-table-body">
      {@render body?.()}
    </div>
  </ExpandableContainer>
</section>
