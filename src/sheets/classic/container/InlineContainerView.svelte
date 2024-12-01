<script lang="ts">
  import ExpandableContainer from 'src/components/expandable/ExpandableContainer.svelte';
  import CapacityBar from './CapacityBar.svelte';
  import ContainerContentsSections from './ContainerContentsSections.svelte';
  import type { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { ContainerContents, Item5e } from 'src/types/item.types';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { CONSTANTS } from 'src/constants';

  interface Props {
    container: Item5e;
    containerContents: ContainerContents;
    editable: boolean;
    inlineToggleService: InlineToggleService;
    lockItemQuantity: boolean;
    sheetDocument: any;
    unlocked?: boolean;
  }

  let {
    container,
    containerContents,
    editable,
    inlineToggleService,
    lockItemQuantity,
    sheetDocument,
    unlocked = true,
  }: Props = $props();

  let inlineToggleServiceStore = $derived(inlineToggleService.store);

  let itemIdsToShow = getContext<Readable<Set<string> | undefined>>(
    CONSTANTS.SVELTE_CONTEXT.ITEM_IDS_TO_SHOW,
  );

  let tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  async function onDrop(
    event: DragEvent & { currentTarget: EventTarget & HTMLElement },
  ) {
    container.sheet._onDrop(event);

    event.preventDefault();
    event.stopImmediatePropagation();
  }
</script>

<ExpandableContainer
  expanded={$inlineToggleServiceStore.get(tabId)?.has(container.id) === true}
  class={!!$itemIdsToShow && !$itemIdsToShow.has(container.id) ? 'hidden' : ''}
>
  <!-- TODO: Apply proper a11y trappings for this -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="flex-column extra-small-gap flex-1 inline-container-view"
    data-tidy-container-id={container.id}
    ondrop={onDrop}
  >
    <CapacityBar {container} capacity={containerContents.capacity} />
    <ContainerContentsSections
      contents={containerContents.contents}
      {container}
      {editable}
      itemContext={containerContents.itemContext}
      {lockItemQuantity}
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
</ExpandableContainer>
