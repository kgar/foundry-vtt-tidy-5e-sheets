<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Item5e, ItemChatData } from 'src/types/item.types';
  import HorizontalLineSeparator from '../layout/HorizontalLineSeparator.svelte';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { CharacterSheetContext } from 'src/types/types';
  import AmmoSelector from '../../sheets/actor/AmmoSelector.svelte';
  import { coalesce } from 'src/utils/formatting';
  import { CONSTANTS } from 'src/constants';

  export let item: Item5e;
  export let chatData: ItemChatData;

  let context = getContext<Readable<CharacterSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  $: ctx = $context.itemContext?.[item.id];
  $: concealDetails = FoundryAdapter.concealDetails(item);

  const localize = FoundryAdapter.localize;
  const weightUnit = FoundryAdapter.getWeightUnit();
</script>

<div
  class="info-card inventory {item.attunement?.cls ?? ''}"
  class:magic-item={item.system.properties?.has('mgc')}
  class:equipped={item.system.equipped}
  data-item-id={item._id}
  data-item-index={item._id}
>
  <p class="info-card-name">
    {item.system.identified === false
      ? coalesce(
          item.system.unidentified.name,
          localize('DND5E.Unidentified.Title'),
        )
      : item.name}
  </p>
  {#if item.system.properties?.has('amm')}
    <p class="ammo-switch" data-id={item._id}>
      <AmmoSelector {item} />
    </p>
    <HorizontalLineSeparator borderColor="faint" />
  {/if}

  {#if item.system.properties?.has('mgc') || ctx?.attunement}
    <div class="info-card-states">
      {#if item.system.properties?.has('mgc')}
        <span class="flex-row extra-small-gap align-items-center"
          ><i class="fas fa-magic" />Magic Item</span
        >
      {/if}
      {#if ctx?.attunement && !concealDetails}
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
      {item.system.weight.value}
      {weightUnit}</span
    >
    <span class="info-quantity"
      ><b>{localize('DND5E.Quantity')}:</b>
      {item.system.quantity}
      {#if item.system.price.value}
        &times;
        {#if concealDetails}
          {localize('DND5E.Unidentified.Value')}
        {:else}
          {item.system.price.value}
          {item.system.price.denomination}
        {/if}
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
    <div class="info-card-description user-select-text">
      {#if concealDetails}
        {@html chatData.unidentified.description}
      {:else}
        {@html chatData.description.value}
      {/if}
    </div>
  </div>

  <slot />
</div>
