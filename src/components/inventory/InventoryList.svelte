<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Item5e } from 'src/types/item';
  import ItemTable from '../items/ItemTable.svelte';
  import ItemTableHeaderRow from '../items/ItemTableHeaderRow.svelte';
  import ItemTableRow from '../items/ItemTableRow.svelte';
  import ItemTableFooter from '../items/ItemTableFooter.svelte';
  import ItemTableColumn from '../items/ItemTableColumn.svelte';
  import ItemTableCell from '../items/ItemTableCell.svelte';
  import ItemUseButton from '../items/ItemUseButton.svelte';
  import ItemName from '../items/ItemName.svelte';
  import { CONSTANTS } from 'src/constants';
  import ItemUses from '../items/ItemUses.svelte';
  import ItemAddUses from '../items/ItemAddUses.svelte';
  import { SettingsProvider } from 'src/settings/settings';
  import ItemControls from '../items/ItemControls.svelte';
  import ItemDuplicateControl from '../items/ItemDuplicateControl.svelte';
  import ItemDeleteControl from '../items/ItemDeleteControl.svelte';
  import ItemEditControl from '../items/ItemEditControl.svelte';
  import InventoryEquipControl from './InventoryEquipControl.svelte';
  import InventoryAttuneControl from './InventoryAttuneControl.svelte';
  import InlineFavoriteIcon from '../shared/InlineFavoriteIcon.svelte';
  import ItemFavoriteControl from '../items/ItemFavoriteControl.svelte';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { ActorSheetContext } from 'src/types/types';

  export let primaryColumnName: string;
  export let items: Item5e[];
  export let extraInventoryRowClasses: string = '';
  export let dataset: Record<string, unknown> | undefined = undefined;
  export let lockControls: boolean = false;
  export let allowFavoriteIconNextToName: boolean = true;
  export let includeWeightColumn: boolean = true;

  let store = getContext<Readable<ActorSheetContext>>('store');

  const localize = FoundryAdapter.localize;
  $: allowEdit = FoundryAdapter.tryGetFlag($store.actor, 'allow-edit');
  $: classicControlsBaseWidth = allowEdit ? '7.5rem' : '5.3125rem';
  $: ammoEquippedOnly = SettingsProvider.settings.ammoEquippedOnly.get();
  $: quantityAlwaysShownEnabled =
    SettingsProvider.settings.quantityAlwaysShownEnabled.get();

  let ammos: { text: string; value: string | null; ammo: Item5e | null }[];
  $: ammos = [
    {
      text: '',
      value: null,
      ammo: null,
    },
    ...$store.actor.items
      .filter(
        (x) =>
          x.system.consumableType === 'ammo' &&
          (!ammoEquippedOnly || x.system.equipped)
      )
      .map((x) => ({
        text: `${x.name} (${x.system.quantity})`,
        value: x.id,
        ammo: x,
      })),
  ];

  $: hideIconsNextToTheItemName =
    SettingsProvider.settings.hideIconsNextToTheItemName.get();
  $: classicControlsEnabled =
    SettingsProvider.settings.classicControlsEnabled.get();

  function getInventoryRowClasses(item: Item5e) {
    const extras: string[] = [];

    if (!quantityAlwaysShownEnabled) {
      extras.push('show-item-count-on-hover');
    }

    if (extraInventoryRowClasses) {
      extras.push(extraInventoryRowClasses);
    }

    return FoundryAdapter.getInventoryRowClasses(
      item,
      $store.itemContext[item.id],
      extras
    );
  }

  function onAmmoChange(item: Item5e, ammoId: string) {
    const ammo = item.actor?.items.find((i) => i.id === ammoId);

    item.update({
      system: {
        consume: {
          amount: !ammo
            ? null
            : !!item.system.consume?.amount
            ? item.system.consume.amount
            : 1,
          target: !ammo ? '' : ammo.id,
          type: !ammo ? '' : ammo.system.consumableType,
        },
      },
    });
  }

  function updateItemQuantity(
    event: FocusEvent & {
      currentTarget: EventTarget & HTMLInputElement;
    },
    item: Item5e
  ) {
    const input = parseInt(event.currentTarget.value);
    const uses = !isNaN(input) ? input : item.system.quantity;
    event.currentTarget.value = uses.toString();
    item.update({ 'system.quantity': uses });
  }
</script>

<section class="inventory-list-section">
  <ItemTable>
    <ItemTableHeaderRow>
      <ItemTableColumn primary={true}>
        {primaryColumnName}
      </ItemTableColumn>
      {#if includeWeightColumn}
        <ItemTableColumn
          title="{localize('DND5E.Weight')} ({$store.weightUnit})"
          baseWidth="2.5rem"
        >
          <i class="fas fa-weight-hanging" />
        </ItemTableColumn>
      {/if}
      <ItemTableColumn title={localize('DND5E.Charges')} baseWidth="3.125rem">
        <i class="fas fa-bolt" />
      </ItemTableColumn>
      <ItemTableColumn baseWidth="7.5rem">
        {localize('DND5E.Usage')}
      </ItemTableColumn>
      {#if !lockControls}
        <ItemTableColumn baseWidth={classicControlsBaseWidth} />
      {/if}
    </ItemTableHeaderRow>
    {#each items as item (item.id)}
      {@const ctx = $store.itemContext[item.id]}
      <ItemTableRow
        {item}
        on:mousedown={(event) =>
          FoundryAdapter.editOnMiddleClick(event.detail, item)}
        contextMenu={{
          type: CONSTANTS.CONTEXT_MENU_TYPE_ITEMS,
          id: item.id,
        }}
        let:toggleSummary
        cssClass={getInventoryRowClasses(item)}
      >
        <ItemTableCell primary={true} title={item.name}>
          <ItemUseButton {item} />
          <ItemName
            on:click={(event) => toggleSummary(event.detail, $store.actor)}
            cssClass="extra-small-gap"
          >
            <span class="truncate">{item.name}</span>
            {#if item.system?.properties?.amm}
              <span class="ammo">
                <select
                  on:click|stopPropagation
                  on:change={(event) =>
                    onAmmoChange(item, event.currentTarget.value)}
                >
                  {#each ammos as ammo}
                    <option
                      value={ammo.value}
                      selected={item.system.consume?.target === ammo.value}
                      >{ammo.text}</option
                    >
                  {/each}
                </select>
              </span>
            {/if}
            <span class="item-quantity" class:isStack={ctx.isStack}>
              (<input
                class="item-count"
                type="text"
                value={item.system.quantity}
                maxlength="3"
                on:click|stopPropagation
                on:blur={(event) => updateItemQuantity(event, item)}
              />)
            </span>
          </ItemName>
        </ItemTableCell>
        {#if !hideIconsNextToTheItemName}
          <ItemTableCell cssClass="no-border">
            {#if ctx.attunement}
              <div class="item-detail attunement">
                <i
                  class="item-state-icon fas {ctx.attunement.icon} {ctx
                    .attunement.cls}"
                  title={localize(ctx.attunement.title)}
                />
              </div>
            {/if}
          </ItemTableCell>
          {#if FoundryAdapter.tryGetFlag(item, 'favorite') && allowFavoriteIconNextToName}
            <InlineFavoriteIcon />
          {/if}
        {/if}
        {#if includeWeightColumn}
          <ItemTableCell
            baseWidth="2.5rem"
            title="{localize('DND5E.Weight')}: {item.system
              .weight} {$store.weightUnit}"
          >
            {#if ctx.totalWeight}
              {ctx.totalWeight} {$store.weightUnit}
            {:else}
              {item.system.weight} {$store.weightUnit}
            {/if}
          </ItemTableCell>
        {/if}
        <ItemTableCell baseWidth="3.125rem" title={localize('DND5E.Uses')}>
          {#if ctx?.hasUses}
            <ItemUses {item} />
          {:else}
            <ItemAddUses {item} />
          {/if}
        </ItemTableCell>
        <ItemTableCell baseWidth="7.5rem" title={localize('DND5E.Usage')}>
          {#if item.system.activation?.type}
            {item.labels.activation}
          {/if}
        </ItemTableCell>
        {#if $store.owner && classicControlsEnabled && !lockControls}
          <ItemTableCell baseWidth={classicControlsBaseWidth}>
            <ItemControls>
              {#if ctx.attunement}
                <InventoryAttuneControl {item} {ctx} />
              {:else}
                <!-- <span /> -->
              {/if}
              {#if ctx.canToggle}
                <InventoryEquipControl {item} {ctx} />
              {/if}
              <ItemFavoriteControl {item} />
              <ItemEditControl {item} />
              {#if allowEdit}
                <ItemDuplicateControl {item} />
                <ItemDeleteControl {item} />
              {/if}
            </ItemControls>
          </ItemTableCell>
        {/if}
      </ItemTableRow>
    {/each}
    {#if $store.owner && allowEdit && dataset}
      <ItemTableFooter actor={$store.actor} {dataset} />
    {/if}
  </ItemTable>
</section>

<style lang="scss">
  .inventory-list-section {
    .item-detail.attunement {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 0.25rem;
    }

    :global(.show-item-count-on-hover .item-quantity) {
      opacity: 0;
      width: 0;
      transition: opacity 0.3s ease;
    }

    :global(.show-item-count-on-hover:hover .item-quantity),
    :global(.show-item-count-on-hover .item-quantity:focus-within) {
      opacity: 1;
      width: unset;
    }
  }

  .item-quantity {
    align-items: center;
    display: flex;
    text-align: center;
    transition: opacity 0.3s ease;

    input {
      width: 1.4375rem;
      height: 100%;
    }
  }
</style>
