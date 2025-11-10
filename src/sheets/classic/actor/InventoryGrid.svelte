<script lang="ts">
  import type {
    CharacterSheetContext,
    InventorySection,
    NpcSheetContext,
  } from 'src/types/types';
  import type { Item5e } from 'src/types/item.types';
  import ItemTable from '../../../components/item-list/v1/ItemTable.svelte';
  import ItemTableHeaderRow from '../../../components/item-list/v1/ItemTableHeaderRow.svelte';
  import ItemTableColumn from '../../../components/item-list/v1/ItemTableColumn.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { CONSTANTS } from 'src/constants';
  import GridPaneFavoriteIcon from '../../../components/item-grid/GridPaneFavoriteIcon.svelte';
  import TextInput from '../../../components/inputs/TextInput.svelte';
  import { settings } from 'src/settings/settings.svelte';
  import { ActorItemRuntime } from 'src/runtime/ActorItemRuntime';
  import { declareLocation } from 'src/types/location-awareness.types';
  import { TidyHooks } from 'src/foundry/TidyHooks';
  import { ItemVisibility } from 'src/features/sections/ItemVisibility';
  import { getSearchResultsContext } from 'src/features/search/search.svelte';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';

  interface Props {
    section: InventorySection;
  }

  let { section }: Props = $props();

  let context =
    $derived(getSheetContext<CharacterSheetContext | NpcSheetContext>());

  let itemEntries = $derived(
    section.items.map((item) => ({
      item: item,
      ctx: context.itemContext[item.id],
    })),
  );

  let customCommands = $derived(
    ActorItemRuntime.getActorItemSectionCommands({
      document: context.actor,
      section,
      unlocked: true,
    }),
  );

  const searchResults = getSearchResultsContext();

  const localize = FoundryAdapter.localize;

  function getInventoryRowClasses(item: Item5e) {
    const extras: string[] = [];

    return FoundryAdapter.getInventoryRowClasses(
      item,
      context.itemContext[item.id],
      extras,
    );
  }

  function preventUseItemEvent(ev: Event) {
    ev.stopPropagation();
  }

  async function onMouseEnter(event: Event, item: Item5e) {
    TidyHooks.tidy5eSheetsItemHoverOn(event, item);
  }

  async function onMouseLeave(event: Event, item: Item5e) {
    TidyHooks.tidy5eSheetsItemHoverOff(event, item);
  }

  function handleDragStart(event: DragEvent, item: Item5e) {
    if (!item) {
      return;
    }

    onMouseLeave(event, item);

    if (event.target !== event.currentTarget) {
      // Allow for draggables within this containing element to be handled elsewhere.
      return;
    }

    const dragData = item.toDragData();
    event.dataTransfer?.setData('text/plain', JSON.stringify(dragData));
  }

  declareLocation('inventory-grid');
</script>

<ItemTable key={section.key} data-custom-section={section.custom ? true : null}>
  {#snippet header()}
    <ItemTableHeaderRow>
      <ItemTableColumn primary={true}>
        <span class="inventory-primary-column-label">
          {localize(section.label)} ({ItemVisibility.countVisibleItems(
            section.items,
            searchResults.uuids,
          )})
        </span>
      </ItemTableColumn>
    </ItemTableHeaderRow>
  {/snippet}
  {#snippet body()}
    <div class="items">
      {#each itemEntries as { item, ctx } (item.id)}
        {@const hidden = !searchResults.show(item.uuid)}
        <a
          class="item {getInventoryRowClasses(item)}"
          class:hidden
          aria-hidden={hidden}
          data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_ITEMS}
          onclick={(event) =>
            context.editable && FoundryAdapter.actorTryUseItem(item, event)}
          oncontextmenu={(event) =>
            FoundryAdapter.onActorItemButtonContextMenu(item, { event })}
          onmousedown={(event) => FoundryAdapter.editOnMiddleClick(event, item)}
          onmouseenter={(ev) => onMouseEnter(ev, item)}
          onmouseleave={(ev) => onMouseLeave(ev, item)}
          ondragstart={(ev) => handleDragStart(ev, item)}
          data-tidy-draggable
          data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_USE_COMMAND}
          data-item-id={item.id}
          tabindex={settings.value.useAccessibleKeyboardSupport ? 0 : -1}
          data-tidy-grid-item
          data-info-card={item ? 'item' : null}
          data-info-card-entity-uuid={item?.uuid ?? null}
        >
          <div class="item-name">
            <div
              class="item-image"
              class:conceal={item.system.identified === false}
              style="background-image: url('{item.img}');"
            >
              <i class="fa fa-dice-d20"></i>
            </div>
            <div
              role="presentation"
              aria-hidden="true"
              class="unidentified-glyph no-transition"
              class:conceal={item.system.identified === false}
            >
              <i class="fas fa-question"></i>
            </div>
          </div>

          {#if ctx.attunement && !FoundryAdapter.concealDetails(item)}
            <i
              class="fas fa-sun icon-attuned {ctx.attunement?.cls ??
                ''} no-pointer-events"
              title={localize(ctx.attunement?.title ?? '')}
            ></i>
          {/if}

          {#if 'favoriteId' in ctx && !!ctx.favoriteId}
            <GridPaneFavoriteIcon />
          {/if}

          {#if context.editable}
            <button
              type="button"
              class="item-control item-edit"
              style="display:none"
              data-action="itemEdit"
              title={localize('DND5E.ItemEdit')}
              tabindex={settings.value.useAccessibleKeyboardSupport ? 0 : -1}
            >
              <i class="fas fa-edit fa-fw"></i>
            </button>
          {/if}

          <div class="item-stats">
            <div
              class="item-detail item-uses"
              title="{localize('DND5E.Uses')}: {item.system.uses?.value}/{item
                .system.uses?.max} "
            >
              {#if ctx?.hasUses}
                <i class="fas fa-bolt"></i>
                <TextInput
                  document={item}
                  field="system.uses.value"
                  value={item.system.uses?.value}
                  placeholder="0"
                  maxlength={2}
                  allowDeltaChanges={true}
                  selectOnFocus={true}
                  onclick={preventUseItemEvent}
                  disabled={!context.editable}
                  onSaveChange={(ev) =>
                    FoundryAdapter.handleDocumentUsesChanged(ev, item) && false}
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
                class="item-count"
                value={item.system.quantity}
                maxlength={2}
                disabled={!context.editable || context.lockItemQuantity}
                allowDeltaChanges={true}
                selectOnFocus={true}
                onclick={preventUseItemEvent}
              />
            </span>
          </div>
        </a>
      {/each}
      {#if context.unlocked}
        <div class="items-footer">
          <button
            type="button"
            class="footer-command icon-button"
            title={localize('DND5E.ItemCreate')}
            onclick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              FoundryAdapter.createItem(
                {
                  ...section.dataset,
                  action: 'itemCreate',
                  tooltip: 'DND5E.ItemCreate',
                },
                context.actor,
              );
            }}
            data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_CREATE_COMMAND}
            tabindex={settings.value.useAccessibleKeyboardSupport ? 0 : -1}
          >
            <i class="fas fa-plus-circle"></i>
          </button>
          {#each customCommands as command}
            <button
              type="button"
              class="footer-command icon-button"
              onclick={(ev) =>
                command.execute?.({
                  section,
                  event: ev,
                  document: context.actor,
                })}
              tabindex={settings.value.useAccessibleKeyboardSupport ? 0 : -1}
              title={localize(command.tooltip ?? '')}
            >
              {#if (command.iconClass ?? '') !== ''}
                <i class={command.iconClass}></i>
              {/if}
              {localize(command.label ?? '')}
            </button>
          {/each}
        </div>
      {/if}
    </div>
  {/snippet}
</ItemTable>

<style lang="less">
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

    --item-width-height: 3.125rem;

    .item {
      width: var(--item-width-height);
      height: var(--item-width-height);
      position: relative;
      margin: 0.1875rem;
      box-shadow: 0 0 0.0625rem 0.0625rem var(--t5e-light-color);
      border-radius: 0.3125rem;

      &.context {
        border: 0.0625rem solid var(--t5e-primary-accent-color);
      }

      &.equipped {
        box-shadow: 0 0 0 0.125rem
          var(--t5e-equipped-item-grid-tile-outline-color);
        background: var(--t5e-equipped-background);

        .item-image {
          box-shadow: 0 0 0.0625rem 0.0625rem inset
            var(--t5e-equipped-item-grid-tile-accent-color);
          border-radius: 0.3125rem;
        }
      }

      // TODO: Determine the best longterm way to support this...
      &.magic-item {
        .item-image {
          box-shadow:
            0 0 0 0.0625rem var(--t5e-magic-accent-color) inset,
            0 0 0.1875rem 0.125rem var(--t5e-magic-accent-color) inset;
          border-radius: 0.3125rem;
        }

        &.equipped .item-image {
          box-shadow:
            0 0 0rem 0.0625rem var(--t5e-magic-accent-color) inset,
            0 0 0 0.0625rem var(--t5e-magic-accent-color) inset,
            0 0 0.1875rem 0.125rem var(--t5e-magic-accent-color) inset;
          border: none;
        }
      }

      .icon-attuned {
        font-size: 0.7188rem;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        color: var(--t5e-attuned-item-grid-icon-color);
        width: 0.8125rem;
        height: 0.8125rem;
        background: var(--t5e-magic-accent-color);
        position: absolute;
        top: -0.0625rem;
        right: -0.0625rem;
        border-radius: 50%;
        box-shadow: 0 0 0.1875rem 0.0625rem var(--t5e-magic-accent-color);

        &.not-attuned {
          background: var(--t5e-attunement-required-color);
          box-shadow: 0 0 0.1875rem 0.0625rem
            var(--t5e-attunement-required-color);
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
        background-repeat: no-repeat;
        background-size: cover;
        background-position: 50% 0;

        i {
          color: var(--t5e-tertiary-color);
          text-align: center;
          font-size: 1.125rem;
          display: none;
        }

        &.conceal {
          filter: grayscale(100%);
        }
      }

      &:not([disabled]):hover .item-name .item-image {
        background-image: none !important; // TODO: Figure out a way to avoid !important

        i {
          display: initial;
        }
      }

      &:hover {
        .unidentified-glyph {
          display: none;
        }
      }

      .unidentified-glyph {
        font-size: calc(var(--item-width-height) - 1.5rem);
      }

      .item-name:hover {
        .item-image:hover i {
          color: var(--t5e-primary-font-color);
        }
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
              var(--t5e-inventory-grid-image-contrast-text-shadow-color);
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
              var(--t5e-inventory-grid-image-contrast-text-shadow-color);
          }
        }
      }

      .item-name:hover ~ .item-stats :global(input) {
        color: var(--t5e-primary-font-color);
        text-shadow: 0 0 0.3125rem
          var(--t5e-inventory-grid-hover-use-item-contrast-text-shadow-color);
      }
    }

    .items-footer {
      flex: 0 0 auto;
      height: 3.125rem;
      margin: 0.125rem;
      display: flex;

      .footer-command {
        display: flex;
        flex: 0 0 3.125rem;
        justify-content: center;
        align-items: center;
        white-space: nowrap;
        height: 100%;
        font-size: 1.5rem;
        color: var(--t5e-faint-color);

        &:hover {
          color: var(--t5e-tertiary-color);
        }
      }
    }
  }
</style>
