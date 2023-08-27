<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Item5e, ItemChatData } from 'src/types/item';
  import HorizontalLineSeparator from '../layout/HorizontalLineSeparator.svelte';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type {
    ActorSheetContext,
    NpcSheetContext,
    VehicleSheetContext,
  } from 'src/types/types';

  export let item: Item5e;
  export let chatData: ItemChatData;

  let store =
    getContext<
      Readable<ActorSheetContext | NpcSheetContext | VehicleSheetContext>
    >('store');

  let ctx = $store.itemContext?.[item.id];

  const localize = FoundryAdapter.localize;

  $: console.log({ what: 'item-info-card', $store, item, ctx });
</script>

<div
  class="info-card {item.attunement?.cls ?? ''}"
  class:magic-item={item.system.properties?.mgc}
  class:equipped={item.system.equipped}
  data-item-id={item._id}
  data-item-index={item._id}
>
  <p class="info-card-name">{item.name}</p>
  {#if item.system.properties?.amm}
    <span class="ammo" data-id={item._id}>TODO: Render Ammo</span>
    <HorizontalLineSeparator borderColor="faint" cssClass="margin-to-edge" />
  {/if}
  <!-- Need some conditional here -->
  <div class="info-card-states">
    {#if item.system.properties?.mgc}<span
        ><i class="fas fa-magic" />Magic Item</span
      >
    {/if}
    {#if item.system.attunement && ctx.attunement}
      <span class="info-attuned {ctx.attunement.cls ?? ''}">
        <i class="fas fa-sun" />{localize(ctx.attunement.title)}</span
      >
    {/if}
  </div>
  <HorizontalLineSeparator borderColor="faint" cssClass="margin-to-edge" />
  {#if item.hasUses}
    <div class="info-card-amount">
      <span
        ><i class="fas fa-bolt" /><b>{localize('DND5E.Charges')}:</b>
        {item.system.uses.value}/{item.system.uses.max}</span
      >
    </div>
    <HorizontalLineSeparator borderColor="faint" cssClass="margin-to-edge" />
  {/if}
  {#if item.system.weight || item.system.quantity}
    <div class="info-card-amount">
      <span class="info-weight"
        ><b>{localize('DND5E.Weight')}:</b>
        {item.system.weight}
        {$store.weightUnit}</span
      >
      <span class="info-quantity"
        ><b>{localize('DND5E.Quantity')}:</b>
        {item.system.quantity}</span
      >
    </div>
    <HorizontalLineSeparator borderColor="faint" cssClass="margin-to-edge" />
  {/if}
  <div class="description-wrap">
    <div class="info-card-description">
      {@html chatData.description.value}
    </div>
  </div>
  <article class="mod-roll-buttons" />
</div>
