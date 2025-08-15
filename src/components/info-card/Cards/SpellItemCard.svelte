<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getSpellItemThemeBackground } from 'src/theme/theme';
  import type { Item5e } from 'src/types/item.types';
  import { coalesce } from 'src/utils/formatting';
  import HorizontalLineSeparator from '../../layout/HorizontalLineSeparator.svelte';
  import { SpellUtils } from 'src/utils/SpellUtils';
  import ItemCardPills from '../Parts/ItemCardPills.svelte';
  import { Enrichers } from 'src/features/enrichers/Enrichers';

  interface Props {
    item: Item5e;
  }

  let { item }: Props = $props();

  const localize = FoundryAdapter.localize;

  const headerBackground = $derived.by(() => {
    const variableName = getSpellItemThemeBackground(item) ?? '';
    if (variableName !== '') {
      return `var(${variableName})`;
    }
    return null;
  });

  let canPrepare = $derived(item.system.canPrepare);
  let owner = $derived<boolean>(item.actor?.isOwner ?? item.isOwner);
  let linked = $derived<Item5e>(item.system.linkedActivity?.item);

  let preparationMap = FoundryAdapter.getSpellPreparationStatesMap();

  let method = $derived(FoundryAdapter.getSpellMethodConfig(item));

  let leftSubtitle = $derived(
    [
      item.labels?.school,
      canPrepare ? preparationMap[item.system.prepared]?.label : undefined,
    ].filterJoin(', '),
  );
</script>

{#await item.getChatData({ secrets: owner }) then chatData}
  <header style:--card-header-background={headerBackground}>
    {item.system.identified === false
      ? coalesce(
          item.system.unidentified.name,
          localize('DND5E.Unidentified.Title'),
        )
      : item.name}
  </header>
  <div class="info-card-content">
    {#if item.labels?.school || (owner && canPrepare)}
      <div class="info-card-states">
        <span>{leftSubtitle ?? ''}</span>
        {#if owner}
          {@const rightSubtitle = [
            FoundryAdapter.getSpellMethodConfig(item)?.getLabel({
              level: method?.slots ? item.system.level || 0 : 1,
              format: 'short',
            }),
          ].filterJoin(', ')}
          <span>{rightSubtitle ?? ''}</span>
        {/if}
      </div>
      <HorizontalLineSeparator borderColor="faint" />
    {/if}
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
  {#if linked}
    <HorizontalLineSeparator borderColor="faint" />
    {#await FoundryAdapter.enrichHtml(Enrichers.reference(linked.uuid, linked.name)) then enriched}
      <div class="info-card-linked-source">
        {@html localize('TIDY5E.Activities.Cast.SourceHintText', {
          itemName: enriched,
        })}
      </div>
    {/await}
  {/if}
  <ItemCardPills {item} {chatData} />
{/await}
