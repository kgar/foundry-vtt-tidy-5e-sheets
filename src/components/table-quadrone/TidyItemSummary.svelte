<script lang="ts">
  import ItemSummaryCommandButtonList from '../item-summary/ItemSummaryCommandButtonList.svelte';
  import type { Item5e, ItemChatData } from 'src/types/item.types';
  import { ItemSummaryRuntime } from 'src/runtime/ItemSummaryRuntime';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { CONSTANTS } from 'src/constants';
  import { Enrichers } from 'src/features/enrichers/Enrichers';
  import TidyInlineActivitiesList from './TidyInlineActivitiesList.svelte';
  import { Activities } from 'src/features/activities/activities';
  import type { ActivityItemContext } from 'src/types/types';
  import { settings } from 'src/settings/settings.svelte';
  import { ItemProperties } from 'src/features/properties/ItemProperties.svelte';

  interface Props {
    chatData: ItemChatData;
    item?: Item5e | undefined;
  }

  let { chatData, item }: Props = $props();

  let itemSummaryCommands = $derived(
    ItemSummaryRuntime.getItemSummaryCommands(item),
  );
  let concealDetails = $derived(FoundryAdapter.concealDetails(item));

  let linked = $derived<Item5e>(item?.system?.linkedActivity?.item);

  let additionalItemProps = $derived(
    ItemProperties.getAdditionalItemProperties(item),
  );

  const localize = FoundryAdapter.localize;

  let activities = $derived.by(() => {
    return item
      ? Activities.getVisibleActivities(
          item,
          item.system.activities,
        ).map<ActivityItemContext>(Activities.getActivityItemContext)
      : [];
  });
</script>

{#if activities.length > 0 && settings.value.inlineActivitiesPosition === CONSTANTS.INLINE_ACTIVITIES_POSITION_TOP}
  <TidyInlineActivitiesList {item} {activities} />
  <!-- <HorizontalLineSeparator /> -->
{/if}
<div
  class="editor-rendered-content"
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_SUMMARY}
>
  {#if linked}
    {#await FoundryAdapter.enrichHtml(Enrichers.reference(linked.uuid, linked.name)) then enriched}
      <div class="item-summary-linked-source">
        {@html localize('TIDY5E.Activities.Cast.SourceHintText', {
          itemName: enriched,
        })}
      </div>
    {/await}
    <!-- <HorizontalLineSeparator /> -->
  {/if}

  {@html chatData.description}

  <div
    class="inline-wrapped-elements"
    class:conceal-content={concealDetails}
    data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_PROPERTY_LIST}
  >
    <div class="left-aligned-elements">
      {#if chatData.properties}
        {#each chatData.properties as prop}<span class="tag">
            <span class="value">
              {prop}
            </span>
          </span>
        {/each}
        {#each additionalItemProps as prop}
          <span class="tag">
            <!-- {#if prop.label}
            <span class="label">{prop.label}</span>
          {/if} -->
            <span class="value">{prop.value}</span>
            {#if prop.parenthetical}
              <span class="parenthetical">({prop.parenthetical})</span>
            {/if}
          </span>
        {/each}
      {/if}
    </div>
    <div class="right-aligned-elements">
      {#if itemSummaryCommands.length}
        <ItemSummaryCommandButtonList {item} />
      {/if}
    </div>
  </div>
</div>
{#if activities.length > 0 && settings.value.inlineActivitiesPosition === CONSTANTS.INLINE_ACTIVITIES_POSITION_BOTTOM}
  <!-- <HorizontalLineSeparator /> -->
  <TidyInlineActivitiesList {item} {activities} />
{/if}
