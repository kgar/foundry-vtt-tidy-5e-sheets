<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import ExpandableContainer from 'src/components/expandable/ExpandableContainer.svelte';
  import { ExpandCollapseService } from 'src/features/expand-collapse/ExpandCollapseService';
  import { declareLocation } from 'src/types/location-awareness.types';
  import { getContext } from 'svelte';
  import type { MessageBus } from 'src/types/types';

  /**
   * A unique identifier for this table when viewed amongst other tables in the same logical grouping of tables, such as a tab.
   */
  export let key: string;
  /**
   * Denotes whether the table can be expanded and collapsed.
   */
  export let toggleable: boolean = true;

  let { class: cssClass, ...attributes } = $$restProps;

  const messageBus = getContext<MessageBus>(
    CONSTANTS.SVELTE_CONTEXT.MESSAGE_BUS,
  );
  const tabId = getContext<string | undefined>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);
  declareLocation('item-table', key);

  const expandCollapseService = ExpandCollapseService.initService(toggleable);

  $: expandedState = expandCollapseService.state;

  $: {
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
  }
</script>

<section
  class="item-table {cssClass ?? ''}"
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_TABLE}
  data-tidy-section-key={key}
  {...attributes}
>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <slot name="header" />
  <ExpandableContainer expanded={$expandedState.expanded}>
    <div class="item-table-body">
      <slot name="body" />
    </div>
  </ExpandableContainer>
</section>
