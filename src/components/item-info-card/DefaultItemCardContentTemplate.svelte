<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Item5e, ItemChatData } from 'src/types/item';
  import HorizontalLineSeparator from '../layout/HorizontalLineSeparator.svelte';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type {
    CharacterSheetContext,
    NpcSheetContext,
    VehicleSheetContext,
  } from 'src/types/types';

  export let item: Item5e;
  export let chatData: ItemChatData;

  let context =
    getContext<
      Readable<CharacterSheetContext | NpcSheetContext | VehicleSheetContext>
    >('context');

  $: ctx = $context.itemContext[item.id];

  const localize = FoundryAdapter.localize;
</script>

<div
  class="info-card {item.attunement?.cls ?? ''}"
  class:magic-item={item.system.properties?.mgc}
  class:equipped={item.system.equipped}
  data-item-id={item._id}
>
  <p class="info-card-name">{item.name}</p>
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
