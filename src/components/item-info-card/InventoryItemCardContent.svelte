<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Item5e, ItemChatData } from 'src/types/item';
  import HorizontalLineSeparator from '../layout/HorizontalLineSeparator.svelte';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { CharacterSheetContext } from 'src/types/types';
  import InventoryAmmoSelector from '../inventory/InventoryAmmoSelector.svelte';

  export let item: Item5e;
  export let chatData: ItemChatData;

  let store = getContext<Readable<CharacterSheetContext>>('store');

  $: ctx = $store.itemContext?.[item.id];

  const localize = FoundryAdapter.localize;
  const weightUnit = FoundryAdapter.getWeightUnit();
</script>

<div
  class="info-card {item.attunement?.cls ?? ''}"
  class:magic-item={item.system.properties?.mgc}
  class:equipped={item.system.equipped}
  data-item-id={item._id}
  data-item-index={item._id}
>
  <p class="info-card-name">
    {item.name}
  </p>
  {#if item.system.properties?.amm}
    <p class="ammo-switch" data-id={item._id}>
      <InventoryAmmoSelector {item} />
    </p>
    <HorizontalLineSeparator borderColor="faint" />
  {/if}

  {#if item.system.properties?.mgc || ctx?.attunement}
    <div class="info-card-states">
      {#if item.system.properties?.mgc}
        <span class="flex-row extra-small-gap align-items-center"
          ><i class="fas fa-magic" />Magic Item</span
        >
      {/if}
      {#if ctx?.attunement}
        <span
          class="flex-row extra-small-gap align-items-center info-attuned {ctx
            .attunement.cls ?? ''}"
        >
          <i class="fas fa-sun" />
          {localize(ctx.attunement.title)}
        </span>
      {/if}
    </div>
    <HorizontalLineSeparator borderColor="faint" />
  {/if}
  <div class="info-card-amount">
    <span class="info-weight"
      ><b>{localize('DND5E.Weight')}:</b>
      {item.system.weight}
      {weightUnit}</span
    >
    <span class="info-quantity"
      ><b>{localize('DND5E.Quantity')}:</b>
      {item.system.quantity}
      {#if item.system.price.value}
        &times; {item.system.price.value}
        {item.system.price.denomination}
      {/if}
    </span>
  </div>
  <HorizontalLineSeparator borderColor="faint" />
  {#if ctx?.hasUses}
    <div class="info-card-amount">
      <span
        ><i class="fas fa-bolt" /><b>{localize('DND5E.Charges')}:</b>
        {item.system.uses.value}/{item.system.uses.max}</span
      >
    </div>
    <HorizontalLineSeparator borderColor="faint" />
  {/if}
  <div class="description-wrap">
    <div class="info-card-description">
      {@html chatData.description.value}
    </div>
  </div>

  <slot />
</div>
