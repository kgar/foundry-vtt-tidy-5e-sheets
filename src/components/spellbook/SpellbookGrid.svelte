<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { type ActorSheetContext, type ItemCardStore } from 'src/types/types';
  import { SettingsProvider } from 'src/settings/settings';
  import ItemTable from '../items/ItemTable.svelte';
  import ItemTableColumn from '../items/ItemTableColumn.svelte';
  import ItemTableHeaderRow from '../items/ItemTableHeaderRow.svelte';
  import SpellSlotMarkers from '../spellbook/SpellSlotMarkers.svelte';
  import SpellSlotUses from '../spellbook/SpellSlotUses.svelte';
  import type { Item5e } from 'src/types/item';
  import GridPaneFavoriteIcon from '../shared/GridPaneFavoriteIcon.svelte';
  import { getContext } from 'svelte';
  import type { Readable, Writable } from 'svelte/store';
  import SpellbookItemCardContent from '../item-info-card/SpellbookItemCardContent.svelte';

  export let section: any;
  export let spells: Item5e[];
  export let cssClass: string | null = null;

  let store = getContext<Readable<ActorSheetContext>>('store');
  let card = getContext<Writable<ItemCardStore>>('card');

  const localize = FoundryAdapter.localize;
  $: allowEdit = FoundryAdapter.tryGetFlag($store.actor, 'allow-edit');

  async function onMouseEnter(item: Item5e) {
    card.update((card) => {
      card.item = item;
      card.itemCardContentTemplate = SpellbookItemCardContent;
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

<section class="spellbook-grid {cssClass}">
  <ItemTable>
    <ItemTableHeaderRow>
      <ItemTableColumn primary={true}>
        <span class="spell-primary-column-label">
          {section.label}
        </span>
        {#if section.usesSlots}
          {#if !SettingsProvider.settings.hideSpellSlotMarker.get()}
            <SpellSlotMarkers {section} />
          {/if}
          <SpellSlotUses {section} />
        {/if}
      </ItemTableColumn>
    </ItemTableHeaderRow>
    <div class="spells">
      {#each spells as spell}
        {@const spellImgUrl = FoundryAdapter.getSpellImageUrl($store, spell)}
        <div
          role="button"
          tabindex="0"
          class="spell {FoundryAdapter.getSpellRowClasses(spell)}"
          data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_ITEMS}
          data-context-menu-entity-id={spell.id}
          on:click={(event) => spell.use({}, { event })}
          on:mousedown={(event) =>
            FoundryAdapter.editOnMiddleClick(event, spell)}
          on:mouseenter={() => onMouseEnter(spell)}
          on:mouseleave={onMouseLeave}
        >
          {#if FoundryAdapter.tryGetFlag(spell, 'favorite')}
            <GridPaneFavoriteIcon />
          {/if}

          <div class="spell-name" role="button">
            <div
              class="spell-image"
              style="background-image: url('/{spellImgUrl}')"
            >
              <i class="fa fa-dice-d20" />
            </div>
          </div>
        </div>
      {/each}
      {#if $store.owner && allowEdit}
        <div class="spells-footer">
          <a
            role="button"
            tabindex="0"
            title={localize('DND5E.SpellCreate')}
            on:click|stopPropagation|preventDefault={() =>
              FoundryAdapter.createItem(section.dataset, $store.actor)}
          >
            <i class="fas fa-plus-circle" />
          </a>
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
        border: 1px solid var(--t5ek-primary-accent);
      }

      &.preparable {
        .spell-image {
          box-shadow: 0 0 0 0.125rem inset var(--t5ek-prepareable);
          border-radius: 0.3125rem;
        }
      }

      &.prepared {
        box-shadow: 0 0 0 0.125rem var(--t5ek-prepared-outline);
        background-color: var(--t5ek-equipped);

        .spell-image {
          box-shadow: 0 0 0.0625rem 0.0625rem inset var(--t5ek-prepared-accent);
          border-radius: 0.3125rem;
        }
      }

      &.pact {
        box-shadow: 0 0 0 0.125rem var(--t5ek-pact-outline);
        background-color: var(--t5ek-pact);

        .spell-image {
          box-shadow: 0 0 0.0625rem 0.0625rem inset var(--t5ek-pact-accent);
          border-radius: 0.3125rem;
        }
      }

      &.at-will {
        box-shadow: 0 0 0 0.125rem var(--t5ek-atwill-outline);
        background-color: var(--t5ek-atwill);

        .spell-image {
          box-shadow: 0 0 0.0625rem 0.0625rem inset var(--t5ek-atwill-accent);
          border-radius: 0.3125rem;
        }
      }

      &.innate {
        box-shadow: 0 0 0 0.125rem var(--t5ek-innate-outline);
        background-color: var(--t5ek-innate);

        .spell-image {
          box-shadow: 0 0 0.0625rem 0.0625rem inset var(--t5ek-innate-accent);
          border-radius: 0.3125rem;
        }
      }

      &.always-prepared {
        box-shadow: 0 0 0 0.125rem var(--t5ek-alwaysprepared-outline);
        background-color: var(--t5ek-alwaysprepared);

        .spell-image {
          box-shadow: 0 0 0.0625rem 0.0625rem inset
            var(--t5ek-alwaysprepared-accent);
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

          &:not(:hover) {
            display: none;
          }
        }
      }

      &:not(.context) .spell-name.rollable:hover .spell-image,
      &:not(.context) .spell-name:hover .spell-image {
        background-image: none !important;
      }

      &:not(.context) .spell-name:hover .spell-image i {
        display: initial;
      }

      .spell-name:hover .spell-image:hover i {
        color: var(--t5ek-primary-font);
      }
    }
    .spells-footer {
      flex: 0 0 3.125rem;
      height: 3.125rem;
      margin: 0.125rem;

      a {
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
