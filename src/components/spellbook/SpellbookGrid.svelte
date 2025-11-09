<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import {
    type CharacterSheetContext,
    type NpcSheetContext,
    type SpellbookSection,
  } from 'src/types/types';
  import ItemTable from '../item-list/v1/ItemTable.svelte';
  import ItemTableColumn from '../item-list/v1/ItemTableColumn.svelte';
  import ItemTableHeaderRow from '../item-list/v1/ItemTableHeaderRow.svelte';
  import type { Item5e } from 'src/types/item.types';
  import GridPaneFavoriteIcon from '../item-grid/GridPaneFavoriteIcon.svelte';
  import { settings } from 'src/settings/settings.svelte';
  import { ActorItemRuntime } from 'src/runtime/ActorItemRuntime';
  import { declareLocation } from 'src/types/location-awareness.types';
  import SpellSlotManagement from './SpellSlotManagement.svelte';
  import ConcentrationOverlayIcon from './ConcentrationOverlayIcon.svelte';
  import { TidyHooks } from 'src/foundry/TidyHooks';
  import { getSearchResultsContext } from 'src/features/search/search.svelte';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';

  interface Props {
    section: SpellbookSection;
    cssClass?: string | null;
  }

  let { section, cssClass = null }: Props = $props();

  let context =
    $derived(getSheetContext<CharacterSheetContext | NpcSheetContext>());

  let searchResultContext = getSearchResultsContext();

  let spellEntries = $derived(
    section.items.map((s) => ({
      item: s,
      ctx: context.itemContext[s.id],
      spellImgUrl: FoundryAdapter.getSpellImageUrl(context, s),
    })),
  );

  let customCommands = $derived(
    ActorItemRuntime.getActorItemSectionCommands({
      document: context.actor,
      section,
      unlocked: true
    }),
  );

  const localize = FoundryAdapter.localize;

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

  declareLocation('spellbook-grid-view');
</script>

<section class="spellbook-grid {cssClass}">
  <ItemTable
    key={section.key}
    data-custom-section={section.custom ? true : null}
  >
    {#snippet header()}
      <ItemTableHeaderRow>
        <ItemTableColumn primary={true}>
          <span class="spell-primary-column-label">
            {localize(section.label)}
          </span>
          {#if section.usesSlots}
            <SpellSlotManagement {section} />
          {/if}
        </ItemTableColumn>
      </ItemTableHeaderRow>
    {/snippet}
    {#snippet body()}
      <div class="spells">
        {#each spellEntries as { item, ctx, spellImgUrl } (item.id)}
          {@const hidden = !searchResultContext.show(item.uuid)}
          <a
            class="spell {FoundryAdapter.getSpellRowClasses(item)}"
            class:hidden
            aria-hidden={hidden}
            data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_ITEMS}
            onclick={(event) => FoundryAdapter.actorTryUseItem(item, event)}
            oncontextmenu={(event) =>
              FoundryAdapter.onActorItemButtonContextMenu(item, { event })}
            onmousedown={(event) =>
              FoundryAdapter.editOnMiddleClick(event, item)}
            onmouseenter={(ev) => onMouseEnter(ev, item)}
            onmouseleave={(ev) => onMouseLeave(ev, item)}
            ondragstart={(ev) => handleDragStart(ev, item)}
            data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_USE_COMMAND}
            data-item-id={item.id}
            tabindex={settings.value.useAccessibleKeyboardSupport ? 0 : -1}
            data-tidy-draggable
            data-tidy-grid-item
            data-info-card={item ? 'item' : null}
            data-info-card-entity-uuid={item?.uuid ?? null}
          >
            {#if 'favoriteId' in ctx && !!ctx.favoriteId}
              <GridPaneFavoriteIcon />
            {/if}
            <div class="spell-name">
              <div
                class="spell-image"
                style="background-image: url('{spellImgUrl}');"
              >
                {#if !ctx.concentration}
                  <i class="fa fa-dice-d20"></i>
                {/if}
                <ConcentrationOverlayIcon
                  --tidy-icon-font-size="1.25rem"
                  {ctx}
                />
              </div>
            </div>
          </a>
        {/each}
        {#if context.unlocked}
          <div class="spells-footer">
            {#if section.canCreate}
              <button
                type="button"
                class="footer-command icon-button"
                title={localize('DND5E.SpellCreate')}
                onclick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  FoundryAdapter.createItem(section.dataset, context.actor);
                }}
                data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_CREATE_COMMAND}
                tabindex={settings.value.useAccessibleKeyboardSupport ? 0 : -1}
              >
                <i class="fas fa-plus-circle"></i>
              </button>
            {/if}
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
                title={localize(command.tooltip ?? '')}
                tabindex={settings.value.useAccessibleKeyboardSupport ? 0 : -1}
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
</section>

<style lang="scss">
  .spell-primary-column-label {
    font-size: 0.75rem;
    line-height: 0.75rem;
    flex: 0 0 3.75rem;
    white-space: nowrap;
  }

  .spellbook-grid {
    .spells {
      padding: 0;
      display: flex;
      flex-wrap: wrap;

      .spell {
        width: 3.125rem;
        height: 3.125rem;
        position: relative;
        margin: 0.1875rem;
        box-shadow: 0 0 0.0625rem 0.0625rem var(--t5e-light-color);
        border-radius: 0.3125rem;

        &.context {
          border: 0.0625rem solid var(--t5e-primary-accent-color);
        }

        &.can-prepare {
          .spell-image {
            box-shadow: 0 0 0 0.125rem inset var(--t5e-prepareable-color);
            border-radius: 0.3125rem;
          }
        }

        &.can-prepare.prepared {
          box-shadow: 0 0 0 0.125rem
            var(--t5e-prepared-item-grid-tile-outline-color);
          background-color: var(--t5e-equipped-background);

          .spell-image {
            box-shadow: 0 0 0.0625rem 0.0625rem inset
              var(--t5e-prepared-item-grid-tile-accent-color);
            border-radius: 0.3125rem;
          }
        }

        &.method-pact.can-prepare.prepared {
          box-shadow: 0 0 0 0.125rem var(--t5e-pact-outline-color);
          background-color: var(--t5e-pact-background);

          .spell-image {
            box-shadow: 0 0 0.0625rem 0.0625rem inset
              var(--t5e-pact-accent-color);
            border-radius: 0.3125rem;
          }
        }

        &.method-atwill {
          box-shadow: 0 0 0 0.125rem var(--t5e-atwill-outline-color);
          background-color: var(--t5e-atwill-background);

          .spell-image {
            box-shadow: 0 0 0.0625rem 0.0625rem inset
              var(--t5e-atwill-accent-color);
            border-radius: 0.3125rem;
          }
        }

        &.method-ritual {
          box-shadow: 0 0 0 0.125rem var(--t5e-ritual-only-outline-color);
          background-color: var(--t5e-ritual-only-background);

          .spell-image {
            box-shadow: 0 0 0.0625rem 0.0625rem inset
              var(--t5e-ritual-only-accent-color);
            border-radius: 0.3125rem;
          }
        }

        &.method-innate {
          box-shadow: 0 0 0 0.125rem var(--t5e-innate-outline);
          background-color: var(--t5e-innate-background);

          .spell-image {
            box-shadow: 0 0 0.0625rem 0.0625rem inset var(--t5e-innate-accent);
            border-radius: 0.3125rem;
          }
        }

        &.can-prepare.always {
          box-shadow: 0 0 0 0.125rem var(--t5e-alwaysprepared-outline-color);
          background-color: var(--t5e-alwaysprepared-background);

          .spell-image {
            box-shadow: 0 0 0.0625rem 0.0625rem inset
              var(--t5e-alwaysprepared-accent-color);
          }
        }

        .spell-name {
          display: block;
          flex: unset;
          width: 100%;
          height: 100%;
          border-radius: 0.3125rem;
          overflow: hidden;
        }

        .spell-image {
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
        }

        &:not([disabled]):hover .spell-name .spell-image {
          background-image: none !important; // TODO: Figure out a way to avoid !important

          i {
            display: initial;
          }
        }

        .spell-name:hover .spell-image:hover i {
          color: var(--t5e-primary-font-color);
        }
      }
      .spells-footer {
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
  }
</style>
