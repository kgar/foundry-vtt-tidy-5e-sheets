<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import ExpandableContainer from 'src/components/expandable/ExpandableContainer.svelte';
  import { ExpandCollapseService } from 'src/features/expand-collapse/ExpandCollapseService';
  import { declareLocation } from 'src/types/location-awareness.types';
  import { getContext } from 'svelte';
  import type { MessageBus } from 'src/types/types';

  interface Props {
    key: string;
    toggleable?: boolean;
    gridTemplateColumns?: string;
    header?: import('svelte').Snippet;
    body?: import('svelte').Snippet;
    [key: string]: any;
  }

  let {
    key,
    toggleable = true,
    gridTemplateColumns = '',
    header,
    body,
    ...rest
  }: Props = $props();

  let { class: cssClass, ...attributes } = rest;

  const messageBus = getContext<MessageBus>(
    CONSTANTS.SVELTE_CONTEXT.MESSAGE_BUS,
  );
  const tabId = getContext<string | undefined>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);
  declareLocation('item-table', key);

  const expandCollapseService = ExpandCollapseService.initService(toggleable);

  let expandedState = $derived(expandCollapseService.state);

  $effect(() => {
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
  class="tidy-table {cssClass ?? ''}"
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_TABLE}
  data-tidy-section-key={key}
  {...attributes}
  style="--grid-template-columns: {gridTemplateColumns}"
>
  {@render header?.()}
  <ExpandableContainer expanded={$expandedState.expanded}>
    <div class="item-table-body">
      {@render body?.()}
    </div>
  </ExpandableContainer>
</section>
