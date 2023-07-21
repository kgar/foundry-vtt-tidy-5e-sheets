<script lang="ts">
  import type { ActorSheetContext } from 'src/types/types';
  import type { Item5e } from 'src/types/item';
  import ItemTable from '../items/ItemTable.svelte';
  import ItemTableHeaderRow from '../items/ItemTableHeaderRow.svelte';
  import ItemTableColumn from '../items/ItemTableColumn.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { CONSTANTS } from 'src/constants';
  import { SettingsProvider } from 'src/settings/settings';

  export let section: any;
  export let items: Item5e[];
  export let context: ActorSheetContext;

  const localize = FoundryAdapter.localize;
  const allowEdit = FoundryAdapter.tryGetFlag(context.actor, 'allow-edit');

  const quantityAlwaysShownEnabled =
    SettingsProvider.settings.quantityAlwaysShownEnabled.get();

  function getInventoryRowClasses(item: Item5e, section: any) {
    const extras: string[] = [];

    if (!quantityAlwaysShownEnabled) {
      extras.push('show-item-count-on-hover');
    }

    return FoundryAdapter.getInventoryRowClasses(
      item,
      section,
      context.itemContext[item.id],
      extras
    );
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
    {#each items as item}
      {@const ctx = context.itemContext[item.id]}

      <div
        role="button"
        tabindex="0"
        class="item {getInventoryRowClasses(item, section)}"
        data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_ITEMS}
        data-context-menu-entity-id={item.id}
        on:click={(event) => item.use({}, { event })}
      >
        {#if ctx.attunement}
          <i
            class="fas fa-sun icon-attuned {ctx.attunement?.cls ?? ''}"
            title={localize(ctx.attunement?.title)}
          />
        {/if}

        {#if FoundryAdapter.tryGetFlag(item, 'favorite')}
          <i
            class="fas fa-bookmark icon-fav"
            title={localize('TIDY5E.isFav')}
          />
        {/if}

        {#if context.owner}
          <a
            class="item-control item-edit"
            style="display:none"
            data-action="itemEdit"
            data-tooltip="DND5E.ItemEdit"
          >
            <i class="fas fa-edit fa-fw" />
          </a>
        {/if}

        <div class="item-name" role="button">
          <div class="item-image" style="background-image: url('/{item.img}')">
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
              <input
                type="text"
                name="system.uses.value"
                value={item.system.uses?.value}
                placeholder="0"
                maxlength="2"
                on:click|stopPropagation
                on:change|stopPropagation={(event) =>
                  item.update({
                    ['system.uses.value']: event.currentTarget.value,
                  })}
              />
            {/if}
          </div>
          <span
            class="item-quantity"
            class:isStack={item.isStack}
            title={localize('DND5E.Quantity')}
          >
            <input
              class="item-count"
              type="text"
              value={item.system.quantity}
              maxlength="2"
              on:click|stopPropagation
              on:change|stopPropagation={(event) =>
                item.update({
                  ['system.quantity']: event.currentTarget.value,
                })}
            />
          </span>
        </div>
      </div>
    {/each}
    {#if context.owner && allowEdit}
      <div class="items-footer">
        <a
          role="button"
          tabindex="0"
          title={localize('DND5E.ItemCreate')}
          on:click|stopPropagation|preventDefault={() =>
            FoundryAdapter.createItem(
              {
                ...section.dataset,
                action: 'itemCreate',
                tooltip: 'DND5E.ItemCreate',
              },
              context.actor
            )}
        >
          <i class="fas fa-plus-circle" />
        </a>
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
      box-shadow: 0 0 0.0625rem 0.0625rem var(--t5e-light-color);
      border-radius: 0.3125rem;

      &.context {
        border: 0.0625rem solid var(--t5e-primary-accent);
      }

      &.equipped {
        box-shadow: 0 0 0 0.125rem var(--t5e-equipped-outline);

        .item-image {
          box-shadow: 0 0 0.0625rem 0.0625rem inset var(--t5e-equipped-accent);
          border-radius: 0.3125rem;
        }
      }

      // TODO: Determine the best longterm way to support this...
      &.magic-item {
        .item-image {
          box-shadow: 0 0 0 0.0625rem var(--t5e-magic-accent) inset,
            0 0 0.1875rem 0.125rem var(--t5e-magic-accent) inset;
          border-radius: 0.3125rem;
        }

        &.equipped .item-image {
          background-image: url('systems/dnd5e/icons/items/inventory/pearl.jpg');
          box-shadow: 0 0 0rem 0.0625rem var(--t5e-magic-outline) inset,
            0 0 0 0.0625rem var(--t5e-magic-accent) inset,
            0 0 0.1875rem 0.125rem var(--t5e-magic-accent) inset;
          border: none;
        }
      }

      .icon-attuned {
        font-size: 0.7188rem;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        color: var(--t5e-icon-attuned);
        width: 0.8125rem;
        height: 0.8125rem;
        background: var(--t5e-magic-accent);
        position: absolute;
        top: -0.0625rem;
        right: -0.0625rem;
        border-radius: 50%;
        box-shadow: 0 0 0.1875rem 0.0625rem var(--t5e-magic-accent);

        &.not-attuned {
          background: var(--t5e-attunement-required);
          box-shadow: 0 0 0.1875rem 0.0625rem var(--t5e-attunement-required);
        }
      }

      .icon-fav {
        position: absolute;
        top: -0.125rem;
        left: 0.25rem;
        color: rgba(0, 200, 100, 1);
        text-shadow: 0 0 0.125rem var(--t5e-primary-color);
        font-size: 0.625rem;
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

        i {
          color: var(--t5e-tertiary-color);
          text-align: center;
          font-size: 1.125rem;

          &:not(:hover) {
            display: none;
          }
        }
      }

      &:not(.context) .item-name.rollable:hover .item-image,
      &:not(.context) .item-name:hover .item-image {
        background-image: none !important;
      }

      &:not(.context) .item-name:hover .item-image i {
        display: initial;
      }

      .item-name:hover .item-image:hover i {
        color: var(--t5e-primary-font);
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
          color: var(--t5e-stat-font);

          input {
            height: 0.875rem;
            text-shadow: 0 0 0.3125rem rgba(0, 0, 0, 1);
            color: var(--t5e-stat-font);
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

          input {
            text-align: left;
          }

          .fa-bolt {
            font-size: 0.5rem;
            margin-right: 0.0625rem;
            text-shadow: 0 0 0.3125rem rgba(0, 0, 0, 1);
          }
        }
      }
    }

    .items-footer {
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
