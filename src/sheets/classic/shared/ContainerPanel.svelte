<script lang="ts">
  import type { ContainerPanelItemContext } from 'src/types/types';
  import CapacityBar from '../container/CapacityBar.svelte';
  import { CONSTANTS } from 'src/constants';
  import type { Item5e } from 'src/types/item.types';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { coalesce } from 'src/utils/formatting';
  import { TidyHooks } from 'src/foundry/TidyHooks';
  import { getSearchResultsContext } from 'src/features/search/search.svelte';

  interface Props {
    containerPanelItems?: ContainerPanelItemContext[];
    searchCriteria?: string;
  }

  let { containerPanelItems = [] }: Props = $props();

  let searchResults = getSearchResultsContext();

  async function onMouseEnter(event: Event, item: Item5e) {
    TidyHooks.tidy5eSheetsItemHoverOn(event, item);
  }

  async function onMouseLeave(event: Event, item: Item5e) {
    TidyHooks.tidy5eSheetsItemHoverOff(event, item);
  }

  function handleDragStart(event: DragEvent, item: Item5e) {
    // Don't show cards while dragging
    onMouseLeave(event, item);

    if (event.target !== event.currentTarget) {
      // Allow for draggables within this containing element to be handled elsewhere.
      return;
    }

    const dragData = item.toDragData();
    event.dataTransfer?.setData('text/plain', JSON.stringify(dragData));
  }
</script>

<ul class="container-panel">
  {#each containerPanelItems as { container, ...capacity } (container.id)}
    <li
      data-tidy-draggable
      data-item-id={container.id}
      ondragstart={(ev) => handleDragStart(ev, container)}
      onmouseenter={(ev) => onMouseEnter(ev, container)}
      onmouseleave={(ev) => onMouseLeave(ev, container)}
      class="container"
      title={container.system.identified === false
        ? coalesce(
            container.system.unidentified.name,
            FoundryAdapter.localize('DND5E.Unidentified.Title'),
          )
        : container.name}
      class:hidden={!searchResults.show(container.uuid)}
      aria-hidden={!searchResults.show(container.uuid)}
      data-info-card={'item'}
      data-info-card-entity-uuid={container.uuid}
    >
      <a
        type="button"
        class="container-image-button"
        onclick={() =>
          (FoundryAdapter.userIsGm() || container.isOwner) &&
          container.sheet.render(true)}
        data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_ITEMS}
      >
        <div
          class="container-image"
          class:conceal={container.system.identified === false}
          style="background-image: url('{container.img}')"
        >
          <div
            role="presentation"
            aria-hidden="true"
            class="unidentified-glyph"
            class:conceal={container.system.identified === false}
          >
            <i class="fas fa-question"></i>
          </div>
        </div>
      </a>
      <CapacityBar
        showLabel={false}
        {container}
        {capacity}
        --capacity-bar-height="0.5rem"
        --capacity-bar-container-border-radius="0 0 0.1875rem 0.1875rem"
      />
    </li>
  {/each}
</ul>
