<script lang="ts">
  import ExpandableContainer from 'src/components/expandable/ExpandableContainer.svelte';
  import ContainerContentsSections from './ContainerContentsSections.svelte';
  import type { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
  import { getContext } from 'svelte';
  import type { ContainerContents, Item5e } from 'src/types/item.types';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { CONSTANTS } from 'src/constants';
  import VerticalFiligreeGuideline from '../../shared/VerticalFiligreeGuideline.svelte';
  import { getSearchResultsContext } from 'src/features/search/search.svelte';
  import type { MessageBus } from 'src/types/types';

  interface Props {
    container: Item5e;
    containerContents: ContainerContents;
    editable: boolean;
    inlineToggleService: InlineToggleService;
    sheetDocument: any;
    unlocked?: boolean;
  }

  let {
    container,
    containerContents,
    editable,
    inlineToggleService,
    sheetDocument,
    unlocked = true,
  }: Props = $props();

  let toggleServiceMap = $derived(inlineToggleService.map);

  const searchResults = getSearchResultsContext();

  let tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  let messageBus = getContext<MessageBus>(CONSTANTS.SVELTE_CONTEXT.MESSAGE_BUS);

  async function onDrop(
    event: DragEvent & { currentTarget: EventTarget & HTMLElement },
  ) {
    container.sheet._onDrop(event);

    event.preventDefault();
    event.stopImmediatePropagation();
  }

  $effect(() => {
    if (
      messageBus?.message?.tabId === tabId &&
      messageBus?.message?.message === CONSTANTS.MESSAGE_BUS_EXPAND_ALL &&
      messageBus?.message?.options?.includeInlineToggles
    ) {
      inlineToggleService.toggle(tabId, container.id, true);
    }
    if (
      messageBus?.message?.tabId === tabId &&
      messageBus?.message?.message === CONSTANTS.MESSAGE_BUS_COLLAPSE_ALL &&
      messageBus?.message?.options?.includeInlineToggles
    ) {
      inlineToggleService.toggle(tabId, container.id, false);
    }
  });
</script>

<ExpandableContainer
  expanded={toggleServiceMap.get(tabId)?.has(container.id) === true}
  class={!searchResults.show(container.uuid) ? 'hidden' : ''}
>
  <div class="inline-content-view filigree-guideline-and-contents full-height">
    <div
      class="flex-column extra-small-gap flex-1 inline-container-view"
      data-tidy-container-id={container.id}
      ondrop={onDrop}
    >
      <ContainerContentsSections
        contents={containerContents.contents}
        {container}
        {editable}
        itemContext={containerContents.itemContext}
        {inlineToggleService}
        {sheetDocument}
        {unlocked}
      />
      {#if !containerContents.contents.some((c) => c.items.length > 0)}
        <div class="empty-container">
          <span class="empty-container-text"
            >{FoundryAdapter.localize('TIDY5E.EmptyContainer')}</span
          >
        </div>
      {/if}
    </div>
  </div>
</ExpandableContainer>
