<script lang="ts">
  import type { ContainerPanelItemContext } from 'src/types/types';
  import CapacityBar from '../container/CapacityBar.svelte';
  import { CONSTANTS } from 'src/constants';

  export let containerPanelItems: ContainerPanelItemContext[] = [];
</script>

<ul class="containers">
  {#each containerPanelItems as containerPanelItems (containerPanelItems.container.id)}
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <li
      draggable="true"
      data-item-id={containerPanelItems.container.id}
      on:dragstart={(event) => {
        const dragData = containerPanelItems.container.toDragData();
        event.dataTransfer?.setData('text/plain', JSON.stringify(dragData));
      }}
      class="container"
      title={containerPanelItems.container.system.identified === false
        ? containerPanelItems.container.system.unidentified.name
        : containerPanelItems.container.name}
    >
      <button
        class="transparent-button"
        on:click={() => containerPanelItems.container.sheet.render(true)}
        data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_ITEMS}
        data-context-menu-document-uuid={containerPanelItems.container.uuid}
      >
        <div
          class="container-image"
          class:conceal={containerPanelItems.container.system.identified ===
            false}
          style="background-image: url('{containerPanelItems.container.img}')"
        >
          <div
            role="presentation"
            aria-hidden="true"
            class="unidentified-glyph"
            class:conceal={containerPanelItems.container.system.identified ===
              false}
          >
            <i class="fas fa-question" />
          </div>
        </div>
      </button>
      <CapacityBar
        showLabel={false}
        container={containerPanelItems.container}
        capacity={containerPanelItems}
        --capacity-bar-height="0.5rem"
        --capacity-bar-container-border-radius="0 0 3px 3px"
      />
    </li>
  {/each}
</ul>

<style lang="scss">
  .containers {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(4.5rem, max-content));
    gap: 0.25rem;
  }

  .container {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .container-image {
    aspect-ratio: 1;
    border: 0.0625rem solid var(--t5e-separator-color);
    border-radius: 0.1875rem 0.1875rem 0 0;
    background-color: var(--t5e-light-color);
    background-size: cover;
    background-position: 50% 0;
    transition: filter 0.75s;

    &.conceal {
      filter: grayscale(100%);
    }
  }

  .unidentified-glyph {
    font-size: 2.5rem;
  }
</style>
