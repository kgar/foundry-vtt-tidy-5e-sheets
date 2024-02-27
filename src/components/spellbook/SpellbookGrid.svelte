<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import {
    type CharacterSheetContext,
    type ItemCardStore,
    type NpcSheetContext,
  } from 'src/types/types';
  import ItemTable from '../item-list/ItemTable.svelte';
  import ItemTableColumn from '../item-list/ItemTableColumn.svelte';
  import ItemTableHeaderRow from '../item-list/ItemTableHeaderRow.svelte';
  import SpellPips from './SpellPips.svelte';
  import SpellSlotUses from '../spellbook/SpellSlotUses.svelte';
  import type { Item5e } from 'src/types/item';
  import GridPaneFavoriteIcon from '../item-grid/GridPaneFavoriteIcon.svelte';
  import { getContext } from 'svelte';
  import type { Readable, Writable } from 'svelte/store';
  import { settingStore } from 'src/settings/settings';
  import { ActorItemRuntime } from 'src/runtime/ActorItemRuntime';
  import { declareLocation } from 'src/types/location-awareness';

  export let section: any;
  export let spells: Item5e[];
  export let cssClass: string | null = null;
  /**
   * An optional subset of item IDs which will hide all other items not included in this set. 
   * Useful for showing only search results, for example.
   */
  export let visibleItemIdSubset: Set<string> | null = null;

  let context =
    getContext<Readable<CharacterSheetContext | NpcSheetContext>>('context');
  let card = getContext<Writable<ItemCardStore>>('card');

  $: customCommands = ActorItemRuntime.getActorItemSectionCommands({
    actor: $context.actor,
    section,
  });

  const localize = FoundryAdapter.localize;

  async function onMouseEnter(event: Event, item: Item5e) {
    Hooks.callAll(CONSTANTS.HOOK_TIDY5E_SHEETS_ITEM_HOVER_ON, event, item);

    card.update((card) => {
      card.item = item;
      return card;
    });
  }

  async function onMouseLeave(event: Event, item: Item5e) {
    Hooks.callAll(CONSTANTS.HOOK_TIDY5E_SHEETS_ITEM_HOVER_OFF, event, item);

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
  <ItemTable location={section.label}>
    <svelte:fragment slot="header">
      <ItemTableHeaderRow>
        <ItemTableColumn primary={true}>
          <span class="spell-primary-column-label">
            {section.label}
          </span>
          {#if section.usesSlots}
            {#if $settingStore.useSpellSlotMarker}
              <SpellPips {section} />
            {/if}
            <SpellSlotUses {section} />
          {/if}
        </ItemTableColumn>
      </ItemTableHeaderRow>
    </svelte:fragment>
    <div class="spells" slot="body">
      {#each spells as spell}
        {@const spellImgUrl = FoundryAdapter.getSpellImageUrl($context, spell)}
        {@const hidden =
          visibleItemIdSubset !== null && !visibleItemIdSubset.has(spell.id)}
        <button
          type="button"
          class="spell {FoundryAdapter.getSpellRowClasses(spell)} icon-button"
          class:hidden
          aria-hidden={hidden}
          data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_ITEMS}
          data-context-menu-entity-id={spell.id}
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
          disabled={!$context.editable}
          data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_USE_COMMAND}
          data-item-id={spell.id}
          tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
        >
          {#if FoundryAdapter.tryGetFlag(spell, 'favorite')}
            <GridPaneFavoriteIcon />
          {/if}
          <div class="spell-name">
            <div
              class="spell-image"
              style="background-image: url('{spellImgUrl}');"
            >
              <i class="fa fa-dice-d20" />
            </div>
          </div>
        </button>
      {/each}
      {#if $context.unlocked}
        <div class="spells-footer">
          {#if section.canCreate}
            <button
              type="button"
              class="footer-command icon-button"
              title={localize('DND5E.SpellCreate')}
              on:click|stopPropagation|preventDefault={() =>
                FoundryAdapter.createItem(section.dataset, $context.actor)}
              data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_CREATE_COMMAND}
              tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
            >
              <i class="fas fa-plus-circle" />
            </button>
          {/if}
          {#each customCommands as command}
            <button
              type="button"
              class="footer-command icon-button"
              on:click={(ev) =>
                command.execute?.({
                  section,
                  event: ev,
                  actor: $context.actor,
                })}
              title={localize(command.tooltip ?? '')}
              tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
            >
              {#if (command.iconClass ?? '') !== ''}
                <i class={command.iconClass} />
              {/if}
              {localize(command.label ?? '')}
            </button>
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
