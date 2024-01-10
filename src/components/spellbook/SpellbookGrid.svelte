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
  import SpellSlotMarkers from '../spellbook/SpellSlotMarkers.svelte';
  import SpellSlotUses from '../spellbook/SpellSlotUses.svelte';
  import type { Item5e } from 'src/types/item';
  import GridPaneFavoriteIcon from '../item-grid/GridPaneFavoriteIcon.svelte';
  import { getContext } from 'svelte';
  import type { Readable, Writable } from 'svelte/store';
  import { settingStore } from 'src/settings/settings';

  export let section: any;
  export let spells: Item5e[];
  export let cssClass: string | null = null;

  let context =
    getContext<Readable<CharacterSheetContext | NpcSheetContext>>('context');
  let card = getContext<Writable<ItemCardStore>>('card');

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
</script>

<section class="spellbook-grid {cssClass}">
  <ItemTable>
    <ItemTableHeaderRow>
      <ItemTableColumn primary={true}>
        <span class="spell-primary-column-label">
          {section.label}
        </span>
        {#if section.usesSlots}
          {#if $settingStore.useSpellSlotMarker}
            <SpellSlotMarkers {section} />
          {/if}
          <SpellSlotUses {section} />
        {/if}
      </ItemTableColumn>
    </ItemTableHeaderRow>
    <div class="spells">
      {#each spells as spell}
        {@const spellImgUrl = FoundryAdapter.getSpellImageUrl($context, spell)}
        <button
          type="button"
          class="spell {FoundryAdapter.getSpellRowClasses(spell)} icon-button"
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
          disabled={!$context.editable}
          on:keydown={(ev) =>
            FoundryAdapter.forceKeyboardManagerEvent(false, ev)}
          on:keyup={(ev) => FoundryAdapter.forceKeyboardManagerEvent(true, ev)}
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
              class="item-create icon-button"
              title={localize('DND5E.SpellCreate')}
              on:click|stopPropagation|preventDefault={() =>
                FoundryAdapter.createItem(section.dataset, $context.actor)}
              on:keydown={(ev) =>
                FoundryAdapter.forceKeyboardManagerEvent(false, ev)}
              on:keyup={(ev) =>
                FoundryAdapter.forceKeyboardManagerEvent(true, ev)}
            >
              <i class="fas fa-plus-circle" />
            </button>
          {/if}
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
        box-shadow: 0 0 0.0625rem 0.0625rem var(--t5ek-light-color);
        border-radius: 0.3125rem;

        &.context {
          border: 0.0625rem solid var(--t5ek-primary-accent-color);
        }

        &.preparable {
          .spell-image {
            box-shadow: 0 0 0 0.125rem inset var(--t5ek-prepareable-color);
            border-radius: 0.3125rem;
          }
        }

        &.prepared {
          box-shadow: 0 0 0 0.125rem
            var(--t5ek-prepared-item-grid-tile-outline-color);
          background-color: var(--t5ek-equipped-background);

          .spell-image {
            box-shadow: 0 0 0.0625rem 0.0625rem inset
              var(--t5ek-prepared-item-grid-tile-accent-color);
            border-radius: 0.3125rem;
          }
        }

        &.pact {
          box-shadow: 0 0 0 0.125rem var(--t5ek-pact-outline-color);
          background-color: var(--t5ek-pact-background);

          .spell-image {
            box-shadow: 0 0 0.0625rem 0.0625rem inset
              var(--t5ek-pact-accent-color);
            border-radius: 0.3125rem;
          }
        }

        &.at-will {
          box-shadow: 0 0 0 0.125rem var(--t5ek-atwill-outline-color);
          background-color: var(--t5ek-atwill-background);

          .spell-image {
            box-shadow: 0 0 0.0625rem 0.0625rem inset
              var(--t5ek-atwill-accent-color);
            border-radius: 0.3125rem;
          }
        }

        &.innate {
          box-shadow: 0 0 0 0.125rem var(--t5ek-innate-outline);
          background-color: var(--t5ek-innate-background);

          .spell-image {
            box-shadow: 0 0 0.0625rem 0.0625rem inset var(--t5ek-innate-accent);
            border-radius: 0.3125rem;
          }
        }

        &.always-prepared {
          box-shadow: 0 0 0 0.125rem var(--t5ek-alwaysprepared-outline-color);
          background-color: var(--t5ek-alwaysprepared-background);

          .spell-image {
            box-shadow: 0 0 0.0625rem 0.0625rem inset
              var(--t5ek-alwaysprepared-accent-color);
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

          i {
            color: var(--t5ek-tertiary-color);
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
          color: var(--t5ek-primary-font-color);
        }
      }
      .spells-footer {
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
  }
</style>
