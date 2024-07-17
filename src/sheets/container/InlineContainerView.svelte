<script lang="ts">
  import ExpandableContainer from 'src/components/expandable/ExpandableContainer.svelte';
  import CapacityBar from './CapacityBar.svelte';
  import ContainerContentsSections from './ContainerContentsSections.svelte';
  import type { InlineContainerToggleService } from 'src/features/containers/InlineContainerToggleService';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { ContainerContents, Item5e } from 'src/types/item.types';

  export let container: Item5e;
  export let containerContents: ContainerContents;
  export let editable: boolean;
  export let inlineContainerToggleService: InlineContainerToggleService;
  export let lockItemQuantity: boolean;
  export let sheetDocument: any;

  $: inlineContainerToggleServiceStore = inlineContainerToggleService.store;

  let itemIdsToShow =
    getContext<Readable<Set<string> | undefined>>('itemIdsToShow');
</script>

<ExpandableContainer
  expanded={$inlineContainerToggleServiceStore.has(container.id)}
  class={!!$itemIdsToShow && !$itemIdsToShow.has(container.id) ? 'hidden' : ''}
>
  <div
    class="flex-column extra-small-gap flex-1 inline-container-view"
    data-tidy-container-id={container.id}
  >
    <CapacityBar {container} capacity={containerContents.capacity} />
    <!-- <Currency document={item} /> -->
    <ContainerContentsSections
      contents={containerContents.contents}
      {container}
      {editable}
      itemContext={containerContents.itemContext}
      {lockItemQuantity}
      {inlineContainerToggleService}
      {sheetDocument}
    />
  </div>
</ExpandableContainer>
