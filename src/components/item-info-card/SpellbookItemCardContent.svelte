<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Item5e, ItemChatData } from 'src/types/item';
  import HorizontalLineSeparator from '../layout/HorizontalLineSeparator.svelte';
  import type { Readable } from 'svelte/store';
  import { getContext } from 'svelte';
  import type {
    CharacterSheetContext,
    NpcSheetContext,
    VehicleSheetContext,
  } from 'src/types/types';

  export let item: Item5e;
  export let chatData: ItemChatData;

  let context =
    getContext<
      Readable<CharacterSheetContext | NpcSheetContext>
    >('context');

  const localize = FoundryAdapter.localize;

  $: spellRowClasses = FoundryAdapter.getSpellRowClasses(item);
  $: ctx = $context.itemContext[item.id];
  $: canPrepare = FoundryAdapter.canPrepareSpell(item);
</script>

<div class="info-card {spellRowClasses}" data-item-id={item._id}>
  <p class="info-card-name">{item.name}</p>
  {#if item.labels.school || ($context.owner && canPrepare)}
    <div class="info-card-states">
      <span>{item.labels.school ?? ''}</span>
      {#if $context.owner}
        {#if canPrepare}
          <span>{ctx.toggleTitle}</span>
        {/if}
      {/if}
    </div>
    <HorizontalLineSeparator borderColor="faint" />
  {/if}
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
