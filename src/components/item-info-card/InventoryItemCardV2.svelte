<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Item5e } from 'src/types/item.types';
  import { coalesce } from 'src/utils/formatting';
  import ItemCardPills from './ItemCardPills.svelte';
  import HorizontalLineSeparator from '../layout/HorizontalLineSeparator.svelte';
  import { getInventoryItemThemeBackground } from 'src/theme/theme';

  interface Props {
    item: Item5e;
  }

  let { item }: Props = $props();

  const concealDetails = $derived(FoundryAdapter.concealDetails(item));
  const attunementContext = $derived.by(() =>
    FoundryAdapter.getAttunementContext(item),
  );

  const headerBackground = $derived.by(() => {
    const variableName = getInventoryItemThemeBackground(item) ?? '';
    if (variableName !== '') {
      return `var(${variableName})`;
    }
    return null;
  });

  const localize = FoundryAdapter.localize;
  const weightUnit = FoundryAdapter.getWeightUnit();

</script>

{#await item.getChatData({ secrets: item.actor?.isOwner }) then chatData}
  <header style:--card-header-background={headerBackground}>
    {item.system.identified === false
      ? coalesce(
          item.system.unidentified.name,
          localize('DND5E.Unidentified.Title'),
        )
      : item.name}
  </header>
  <div class="info-card-content">
    {#if item.system.properties?.has('mgc') || attunementContext}
      <div class="info-card-states">
        {#if item.system.properties?.has('mgc')}
          <span class="flex-row extra-small-gap align-items-center"
            ><i class="fas fa-magic"></i>Magic Item</span
          >
        {/if}
        {#if attunementContext && !concealDetails}
          <span
            class="flex-row extra-small-gap align-items-center info-attuned {attunementContext.cls ??
              ''}"
          >
            <i class="fas fa-sun"></i>
            {localize(attunementContext.title)}
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
    {#if item.hasLimitedUses}
      <div class="info-card-amount">
        <span
          ><i class="fas fa-bolt"></i><b>{localize('DND5E.Charges')}:</b>
          {item.system.uses.value}/{item.system.uses.max}</span
        >
      </div>
      <HorizontalLineSeparator borderColor="faint" />
    {/if}
    <div class="description-wrap">
      <div class="info-card-description user-select-text">
        {@html chatData.description}
      </div>
    </div>
  </div>
  <ItemCardPills {item} {chatData} />
{/await}
