<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import {
    type CharacterSheetContext,
    type ItemCardStore,
    type NpcSheetContext,
    type SpellbookSection,
  } from 'src/types/types';
  import ItemTable from '../item-list/v1/ItemTable.svelte';
  import ItemTableColumn from '../item-list/v1/ItemTableColumn.svelte';
  import ItemTableHeaderRow from '../item-list/v1/ItemTableHeaderRow.svelte';
  import type { Item5e } from 'src/types/item.types';
  import GridPaneFavoriteIcon from '../item-grid/GridPaneFavoriteIcon.svelte';
  import { getContext } from 'svelte';
  import type { Readable, Writable } from 'svelte/store';
  import { ActorItemRuntime } from 'src/runtime/ActorItemRuntime';
  import { declareLocation } from 'src/types/location-awareness.types';
  import SpellSlotManagement from './SpellSlotManagement.svelte';
  import ConcentrationOverlayIcon from './ConcentrationOverlayIcon.svelte';
  import { TidyHooks } from 'src/foundry/TidyHooks';

  export let section: SpellbookSection;
  export let spells: Item5e[];
  export let cssClass: string | null = null;

  let context = getContext<Readable<CharacterSheetContext | NpcSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );
  let card = getContext<Writable<ItemCardStore>>(CONSTANTS.SVELTE_CONTEXT.CARD);

  let itemIdsToShow = getContext<Readable<Set<string> | undefined>>(
    CONSTANTS.SVELTE_CONTEXT.ITEM_IDS_TO_SHOW,
  );

  $: customCommands = ActorItemRuntime.getActorItemSectionCommands({
    actor: $context.actor,
    section,
  });

  const localize = FoundryAdapter.localize;

  async function onMouseEnter(event: Event, item: Item5e) {
    TidyHooks.tidy5eSheetsItemHoverOn(event, item);

    card.update((card) => {
      card.item = item;
      return card;
    });
  }

  async function onMouseLeave(event: Event, item: Item5e) {
    TidyHooks.tidy5eSheetsItemHoverOff(event, item);

    card.update((card) => {
      card.item = null;
      return card;
    });
  }

  function handleDragStart(event: DragEvent, item: Item5e) {
    if (!item) {
      return;
    }

    // Don't show cards while dragging
    onMouseLeave(event, item);

    card.update((card) => {
      return card;
    });

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
    <svelte:fragment slot="header">
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
    </svelte:fragment>
    <div class="spells" slot="body">
      {#each spells as spell}
        {@const ctx = $context.itemContext[spell.id]}
        {@const spellImgUrl = FoundryAdapter.getSpellImageUrl($context, spell)}
        {@const hidden = !!$itemIdsToShow && !$itemIdsToShow.has(spell.id)}
        <!-- svelte-ignore a11y-missing-attribute -->
        <a
          class="spell {FoundryAdapter.getSpellRowClasses(
            spell,
          )} transparent-button"
          class:hidden
          aria-hidden={hidden}
          data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_ITEMS}
          data-context-menu-document-uuid={spell.uuid}
          on:click={(event) =>
            FoundryAdapter.actorTryUseItem(spell, {}, { event })}
          on:contextmenu={(event) =>
            FoundryAdapter.onActorItemButtonContextMenu(spell, { event })}
          on:mousedown={(event) =>
            FoundryAdapter.editOnMiddleClick(event, spell)}
          on:mouseenter={(ev) => onMouseEnter(ev, spell)}
          on:mouseleave={(ev) => onMouseLeave(ev, spell)}
          on:dragstart={(ev) => handleDragStart(ev, spell)}
          draggable={true}
          data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_USE_COMMAND}
          data-item-id={spell.id}
          data-tidy-grid-item
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
                <i class="fa fa-dice-d20" />
              {/if}
              <ConcentrationOverlayIcon --tidy-icon-font-size="1.25rem" {ctx} />
            </div>
          </div>
        </a>
      {/each}
      {#if $context.unlocked}
        <div class="spells-footer">
          {#if section.canCreate}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <!-- svelte-ignore a11y-missing-attribute -->
            <a
              class="footer-command icon-button"
              title={localize('DND5E.SpellCreate')}
              on:click|stopPropagation|preventDefault={() =>
                FoundryAdapter.createItem(section.dataset, $context.actor)}
              data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_CREATE_COMMAND}
            >
              <i class="fas fa-plus-circle" />
            </a>
          {/if}
          {#each customCommands as command}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <!-- svelte-ignore a11y-missing-attribute -->
            <a
              class="footer-command icon-button"
              on:click={(ev) =>
                command.execute?.({
                  section,
                  event: ev,
                  actor: $context.actor,
                })}
              title={localize(command.tooltip ?? '')}
            >
              {#if (command.iconClass ?? '') !== ''}
                <i class={command.iconClass} />
              {/if}
              {localize(command.label ?? '')}
            </a>
          {/each}
        </div>
      {/if}
    </div>
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

        &.preparable {
          .spell-image {
            box-shadow: 0 0 0 0.125rem inset var(--t5e-prepareable-color);
            border-radius: 0.3125rem;
          }
        }

        &.prepared {
          box-shadow: 0 0 0 0.125rem
            var(--t5e-prepared-item-grid-tile-outline-color);
          background-color: var(--t5e-equipped-background);

          .spell-image {
            box-shadow: 0 0 0.0625rem 0.0625rem inset
              var(--t5e-prepared-item-grid-tile-accent-color);
            border-radius: 0.3125rem;
          }
        }

        &.pact {
          box-shadow: 0 0 0 0.125rem var(--t5e-pact-outline-color);
          background-color: var(--t5e-pact-background);

          .spell-image {
            box-shadow: 0 0 0.0625rem 0.0625rem inset
              var(--t5e-pact-accent-color);
            border-radius: 0.3125rem;
          }
        }

        &.at-will {
          box-shadow: 0 0 0 0.125rem var(--t5e-atwill-outline-color);
          background-color: var(--t5e-atwill-background);

          .spell-image {
            box-shadow: 0 0 0.0625rem 0.0625rem inset
              var(--t5e-atwill-accent-color);
            border-radius: 0.3125rem;
          }
        }

        &.ritual-only {
          box-shadow: 0 0 0 0.125rem var(--t5e-ritual-only-outline-color);
          background-color: var(--t5e-ritual-only-background);

          .spell-image {
            box-shadow: 0 0 0.0625rem 0.0625rem inset
              var(--t5e-ritual-only-accent-color);
            border-radius: 0.3125rem;
          }
        }

        &.innate {
          box-shadow: 0 0 0 0.125rem var(--t5e-innate-outline);
          background-color: var(--t5e-innate-background);

          .spell-image {
            box-shadow: 0 0 0.0625rem 0.0625rem inset var(--t5e-innate-accent);
            border-radius: 0.3125rem;
          }
        }

        &.always-prepared {
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
