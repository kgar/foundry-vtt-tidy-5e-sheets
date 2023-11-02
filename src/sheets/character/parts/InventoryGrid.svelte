<script lang="ts">
  import type { CharacterSheetContext, ItemCardStore } from 'src/types/types';
  import type { Item5e } from 'src/types/item';
  import ItemTable from '../../../components/item-list/ItemTable.svelte';
  import ItemTableHeaderRow from '../../../components/item-list/ItemTableHeaderRow.svelte';
  import ItemTableColumn from '../../../components/item-list/ItemTableColumn.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { CONSTANTS } from 'src/constants';
  import GridPaneFavoriteIcon from '../../../components/item-grid/GridPaneFavoriteIcon.svelte';
  import { getContext } from 'svelte';
  import type { Readable, Writable } from 'svelte/store';
  import TextInput from '../../../components/form/TextInput.svelte';
  import InventoryItemCardContent from '../../../components/item-info-card/InventoryItemCardContent.svelte';
  import { settingStore } from 'src/settings/settings';

  export let section: any;
  export let items: Item5e[];

  let context = getContext<Readable<CharacterSheetContext>>('context');
  let card = getContext<Writable<ItemCardStore>>('card');

  const localize = FoundryAdapter.localize;

  function getInventoryRowClasses(item: Item5e) {
    const extras: string[] = [];

    return FoundryAdapter.getInventoryRowClasses(
      item,
      $context.itemContext[item.id],
      extras
    );
  }

  function preventUseItemEvent(ev: Event) {
    ev.stopPropagation();
  }

  async function onMouseEnter(item: Item5e) {
    card.update((card) => {
      card.item = item;
      card.itemCardContentTemplate = InventoryItemCardContent;
      return card;
    });
  }

  async function onMouseLeave() {
    card.update((card) => {
      card.item = null;
      card.itemCardContentTemplate = null;
      return card;
    });
  }
</script>

<ItemTable>
  <ItemTableHeaderRow>
    <ItemTableColumn primary={true}>
      <span class="inventory-primary-column-label">
        {localize(section.label)} ({items.length})
      </span>
    </ItemTableColumn>
  </ItemTableHeaderRow>
  <div class="items">
    {#each items as item (item.id)}
      {@const ctx = $context.itemContext[item.id]}

      <button
        type="button"
        class="item {getInventoryRowClasses(item)} transparent-button"
        class:show-item-count-on-hover={!$settingStore.quantityAlwaysShownEnabled}
        data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_ITEMS}
        data-context-menu-entity-id={item.id}
        on:click={(event) => $context.owner && item.use({}, { event })}
        on:mousedown={(event) => FoundryAdapter.editOnMiddleClick(event, item)}
        on:mouseenter={() => onMouseEnter(item)}
        on:mouseleave={onMouseLeave}
        disabled={!$context.owner}
      >
        {#if ctx.attunement}
          <i
            class="fas fa-sun icon-attuned {ctx.attunement?.cls ?? ''}"
            title={localize(ctx.attunement?.title)}
          />
        {/if}

        {#if FoundryAdapter.tryGetFlag(item, 'favorite')}
          <GridPaneFavoriteIcon />
        {/if}

        {#if $context.owner}
          <button
            type="button"
            class="item-control item-edit"
            style="display:none"
            data-action="itemEdit"
            title={localize('DND5E.ItemEdit')}
          >
            <i class="fas fa-edit fa-fw" />
          </button>
        {/if}

        <div class="item-name">
          <div class="item-image" style="--bg-image: url('/{item.img}');">
            <i class="fa fa-dice-d20" />
          </div>
        </div>

        <div class="item-stats">
          <div
            class="item-detail item-uses"
            title="{localize('DND5E.Uses')}: {item.system.uses?.value}/{item
              .system.uses?.max} "
          >
            {#if ctx.hasUses}
              <i class="fas fa-bolt" />
              <TextInput
                document={item}
                field="system.uses.value"
                value={item.system.uses?.value}
                placeholder="0"
                maxlength={2}
                allowDeltaChanges={true}
                selectOnFocus={true}
                on:click={preventUseItemEvent}
                disabled={!$context.owner}
              />
            {/if}
          </div>
          <span
            class="item-quantity"
            class:isStack={item.isStack}
            title={localize('DND5E.Quantity')}
          >
            <TextInput
              document={item}
              field="system.quantity"
              cssClass="item-count"
              value={item.system.quantity}
              maxlength={2}
              disabled={!$context.owner || $context.lockItemQuantity}
              allowDeltaChanges={true}
              selectOnFocus={true}
              on:click={preventUseItemEvent}
            />
          </span>
        </div>
      </button>
    {/each}
    {#if $context.editable}
      <div class="items-footer">
        <button
          type="button"
          class="item-create icon-button"
          title={localize('DND5E.ItemCreate')}
          on:click|stopPropagation|preventDefault={() =>
            FoundryAdapter.createItem(
              {
                ...section.dataset,
                action: 'itemCreate',
                tooltip: 'DND5E.ItemCreate',
              },
              $context.actor
            )}
        >
          <i class="fas fa-plus-circle" />
        </button>
      </div>
    {/if}
  </div>
</ItemTable>

<style lang="scss">
  .inventory-primary-column-label {
    font-size: 0.75rem;
    line-height: 0.75rem;
    flex: 0 0 3.75rem;
    white-space: nowrap;
  }

  .items {
    padding: 0;
    display: flex;
    flex-wrap: wrap;

    .item {
      width: 3.125rem;
      height: 3.125rem;
      position: relative;
      margin: 0.1875rem;
      box-shadow: 0 0 0.0625rem 0.0625rem var(--t5ek-light-color);
      border-radius: 0.3125rem;

      &.context {
        border: 0.0625rem solid var(--t5ek-primary-accent-color);
      }

      &.equipped {
        box-shadow: 0 0 0 0.125rem
          var(--t5ek-equipped-item-grid-tile-outline-color);
        background: var(--t5ek-equipped-background);

        .item-image {
          box-shadow: 0 0 0.0625rem 0.0625rem inset
            var(--t5ek-equipped-item-grid-tile-accent-color);
          border-radius: 0.3125rem;
        }
      }

      // TODO: Determine the best longterm way to support this...
      &.magic-item {
        .item-image {
          box-shadow: 0 0 0 0.0625rem var(--t5ek-magic-accent-color) inset,
            0 0 0.1875rem 0.125rem var(--t5ek-magic-accent-color) inset;
          border-radius: 0.3125rem;
        }

        &.equipped .item-image {
          box-shadow: 0 0 0rem 0.0625rem
              var(--t5ek-magic-item-grid-tile-outline-color) inset,
            0 0 0 0.0625rem var(--t5ek-magic-accent-color) inset,
            0 0 0.1875rem 0.125rem var(--t5ek-magic-accent-color) inset;
          border: none;
        }
      }

      .icon-attuned {
        font-size: 0.7188rem;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        color: var(--t5ek-attuned-item-grid-icon-color);
        width: 0.8125rem;
        height: 0.8125rem;
        background: var(--t5ek-magic-accent-color);
        position: absolute;
        top: -0.0625rem;
        right: -0.0625rem;
        border-radius: 50%;
        box-shadow: 0 0 0.1875rem 0.0625rem var(--t5ek-magic-accent-color);

        &.not-attuned {
          background: var(--t5ek-attunement-required-color);
          box-shadow: 0 0 0.1875rem 0.0625rem
            var(--t5ek-attunement-required-color);
        }
      }

      .item-name {
        display: block;
        flex: unset;
        width: 100%;
        height: 100%;
        border-radius: 0.3125rem;
        overflow: hidden;
      }

      .item-image {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        margin: 0;
        border-radius: 0;
        background-image: var(--bg-image);
        background-repeat: no-repeat;
        background-size: cover;

        i {
          color: var(--t5ek-tertiary-color);
          text-align: center;
          font-size: 1.125rem;
          display: none;
        }
      }

      &:not([disabled]):hover .item-name .item-image {
        background-image: none;

        i {
          display: initial;
        }
      }

      .item-name:hover .item-image:hover i {
        color: var(--t5ek-primary-font-color);
      }

      &:global(.show-item-count-on-hover :is(.item-uses, .item-quantity)) {
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      &:global(.show-item-count-on-hover:hover :is(.item-uses, .item-quantity)),
      &:global(
          .show-item-count-on-hover :is(.item-uses, .item-quantity):focus-within
        ) {
        opacity: 1;
      }

      .item-stats {
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        padding: 0 0.125rem 0 0.1875rem;
        height: 0.875rem;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .item-quantity,
        .item-uses {
          border: none;
          font-size: 0.75rem;

          :global(input) {
            height: 0.875rem;
            text-shadow: 0 0 0.3125rem
              var(--t5ek-inventory-grid-image-contrast-text-shadow-color);
            text-align: right;
            min-width: 0;
            width: 1rem;
            padding: 0;
          }
        }

        .item-uses {
          line-height: 1;
          display: flex;
          align-items: center;

          :global(input) {
            text-align: left;
          }

          .fa-bolt {
            font-size: 0.5rem;
            margin-right: 0.0625rem;
            text-shadow: 0 0 0.3125rem
              var(--t5ek-inventory-grid-image-contrast-text-shadow-color);
          }
        }
      }

      .item-name:hover ~ .item-stats :global(input) {
        color: var(--t5ek-primary-font-color);
        text-shadow: 0 0 0.3125rem
          var(--t5ek-inventory-grid-hover-use-item-contrast-text-shadow-color);
      }
    }

    .items-footer {
      flex: 0 0 3.125rem;
      height: 3.125rem;
      margin: 0.125rem;

      .item-create {
        display: flex;
        justify-content: center;
        align-items: center;
        white-space: nowrap;
        height: 100%;
        font-size: 1.5rem;
        color: var(--t5ek-faint-color);

        &:hover {
          color: var(--t5ek-tertiary-color);
        }
      }
    }
  }
</style>
