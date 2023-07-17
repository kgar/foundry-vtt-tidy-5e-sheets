<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import {
    FoundryAdapter,
    type CharacterSheetContext,
  } from 'src/foundry/foundry-adapter';
  import { SettingsProvider } from 'src/settings/settings';
  import ItemTable from '../items/ItemTable.svelte';
  import ItemTableColumn from '../items/ItemTableColumn.svelte';
  import ItemTableHeaderRow from '../items/ItemTableHeaderRow.svelte';
  import SpellSlotMarkers from '../items/SpellSlotMarkers.svelte';
  import SpellSlotUses from '../items/SpellSlotUses.svelte';

  export let context: CharacterSheetContext;
  export let section: any;
  export let spells: any[];

  const localize = FoundryAdapter.localize;
  const allowEdit = FoundryAdapter.tryGetFlag(context.actor, 'allow-edit');
</script>

<section class="spellbook-grid">
  <ItemTable>
    <ItemTableHeaderRow>
      <ItemTableColumn primary={true}>
        <span class="spell-primary-column-label">
          {section.label}
        </span>
        {#if section.usesSlots}
          {#if !SettingsProvider.settings.hideSpellSlotMarker.get()}
            <SpellSlotMarkers {context} {section} />
          {/if}
          <SpellSlotUses {context} {section} />
        {/if}
      </ItemTableColumn>
    </ItemTableHeaderRow>
    <div class="spells">
      {#each spells as spell}
        <div
          class="spell {FoundryAdapter.getSpellRowClasses(spell)}"
          data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_ITEMS}
          data-context-menu-entity-id={spell.id}
          on:click={(event) => spell.use({}, { event })}
        >
          <div class="spell-name" role="button">
            <div class="spell-image" style="background-image: url({spell.img})">
              <i class="fa fa-dice-d20" />
            </div>
          </div>
        </div>
      {/each}
      {#if context.owner && allowEdit}
        <div class="spells-footer">
          <a
            class="spell-create"
            title={localize('DND5E.SpellCreate')}
            on:click={() =>
              FoundryAdapter.createItem(section.dataset, context.actor)}
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
      box-shadow: 0 0 0.0625rem 0.0625rem var(--t5e-light-color);
      border-radius: 0.3125rem;

      &.preparable {
        .spell-image {
          box-shadow: 0 0 0 0.125rem inset var(--t5e-prepareable);
          border-radius: 0.3125rem;
        }
      }

      &.prepared {
        box-shadow: 0 0 0 0.125rem var(--t5e-prepared-outline);
        background-color: var(--t5e-equipped);

        .spell-image {
          box-shadow: 0 0 0.0625rem 0.0625rem inset var(--t5e-prepared-accent);
          border-radius: 0.3125rem;
        }
      }

      &.pact {
        box-shadow: 0 0 0 0.125rem var(--t5e-pact-outline);
        background-color: var(--t5e-pact);

        .spell-image {
          box-shadow: 0 0 0.0625rem 0.0625rem inset var(--t5e-pact-accent);
          border-radius: 0.3125rem;
        }
      }

      &.at-will {
        box-shadow: 0 0 0 0.125rem var(--t5e-atwill-outline);
        background-color: var(--t5e-atwill);

        .spell-image {
          box-shadow: 0 0 0.0625rem 0.0625rem inset var(--t5e-atwill-accent);
          border-radius: 0.3125rem;
        }
      }

      &.innate {
        box-shadow: 0 0 0 0.125rem var(--t5e-innate-outline);
        background-color: var(--t5e-innate);

        .spell-image {
          box-shadow: 0 0 0.0625rem 0.0625rem inset var(--t5e-innate-accent);
          border-radius: 0.3125rem;
        }
      }

      &.always-prepared {
        box-shadow: 0 0 0 0.125rem var(--t5e-alwaysprepared-outline);
        background-color: var(--t5e-alwaysprepared);

        .spell-image {
          box-shadow: 0 0 0.0625rem 0.0625rem inset
            var(--t5e-alwaysprepared-accent);
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
          color: var(--t5e-tertiary-color);
          text-align: center;
          font-size: 1.125rem;

          &:not(:hover) {
            display: none;
          }
        }
      }

      .spell-name.rollable:hover .spell-image,
      .spell-name:hover .spell-image {
        background-image: none !important;
      }

      .spell-name:hover .spell-image i {
        display: initial;
      }

      .spell-name:hover .spell-image:hover {
        background-image: none !important;
      }

      .spell-name:hover .spell-image:hover i {
        color: var(--t5e-primary-font);
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
        color: var(--t5e-faint-color);

        &:hover {
          color: var(--t5e-tertiary-color);
        }
      }
    }
  }
</style>
