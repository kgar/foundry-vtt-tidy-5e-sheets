<script module>
  export type TidyTableColumns = {
    name: string;
    width: string;
  }[];
</script>

<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import ExpandableContainer from 'src/components/expandable/ExpandableContainer.svelte';
  import { ExpandCollapseService } from 'src/features/expand-collapse/ExpandCollapseService.svelte';
  import { declareLocation } from 'src/types/location-awareness.types';
  import { getContext, type Snippet } from 'svelte';
  import type { MessageBus } from 'src/types/types';

  interface Props {
    key: string;
    toggleable?: boolean;
    gridTemplateColumns?: TidyTableColumns;
    header?: Snippet;
    body?: Snippet;
    [key: string]: any;
  }

  let {
    key,
    toggleable = true,
    gridTemplateColumns = [],
    header,
    body,
    ...rest
  }: Props = $props();

  let templateColumnsValue = $derived(
    gridTemplateColumns.map((c) => `/* ${c.name} */ ${c.width}`).join(' '),
  );

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
      messageBus?.message?.tabId === tabId &&
      messageBus?.message?.message === CONSTANTS.MESSAGE_BUS_EXPAND_ALL
    ) {
      expandCollapseService.set(true);
    }
    if (
      messageBus?.message?.tabId === tabId &&
      messageBus?.message?.message === CONSTANTS.MESSAGE_BUS_COLLAPSE_ALL
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
  style="--grid-template-columns: {templateColumnsValue}"
>
  {@render header?.()}
  <ExpandableContainer expanded={expandedState?.expanded}>
    <div class="item-table-body">
      {@render body?.()}
    </div>
  </ExpandableContainer>
</section>
