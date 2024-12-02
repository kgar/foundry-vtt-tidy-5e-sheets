<script lang="ts">
  import type { Item5e } from 'src/types/item.types';
  import ItemCardPills from './ItemCardPills.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { coalesce } from 'src/utils/formatting';
  import HorizontalLineSeparator from '../layout/HorizontalLineSeparator.svelte';

  interface Props {
    item: Item5e;
  }

  let { item }: Props = $props();

  const localize = FoundryAdapter.localize;
</script>

{#if !FoundryAdapter.concealDetails(item)}
  {#await item.getChatData({ secrets: item.actor?.isOwner }) then chatData}
    <header>
      {item.system.identified === false
        ? coalesce(
            item.system.unidentified.name,
            localize('DND5E.Unidentified.Title'),
          )
        : item.name}
    </header>
    <div class="info-card-content">
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
{:else}
  TODO: Show unidentified text, or blank.
{/if}
