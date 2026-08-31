<script lang="ts">
  import ItemSummaryCommandButtonList from '../item-summary/ItemSummaryCommandButtonList.svelte';
  import type { Item5e, ItemChatData } from 'src/types/item.types';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { CONSTANTS } from 'src/constants';
  import { Enrichers } from 'src/features/enrichers/Enrichers';
  import InlineActivitiesList from './InlineActivitiesList.svelte';
  import { Activities } from 'src/features/activities/activities';
  import type { ActivityItemContext } from 'src/types/types';
  import { settings } from 'src/settings/settings.svelte';
  import { ItemProperties } from 'src/features/properties/ItemProperties.svelte';
  import PropertyTag from '../properties/PropertyTag.svelte';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';

  interface Props {
    chatData: ItemChatData;
    item: Item5e;
  }

  let { chatData, item }: Props = $props();

  let additionalItemProps = $derived(
    ItemProperties.getAdditionalItemProperties(item),
  );

  const context = $derived(getSheetContext());

  let concealDetails = $derived(FoundryAdapter.concealDetails(item) || (FoundryAdapter.userIsGm() && !FoundryAdapter.isInGmEditMode(context.document)));

  let isGm = $derived(FoundryAdapter.userIsGm());
  let identified = $derived(item.system.identified !== false);
  let showGmUnidentifiedDescription = $derived(
    isGm && !identified && !!item.system.unidentified?.description,
  );
  let enrichmentOptions = $derived({
    relativeTo: item,
    rollData: item.getRollData(),
    secrets: item.isOwner,
  });

  let linked = $derived<Item5e>(item?.system?.linkedActivity?.item);


  const localize = FoundryAdapter.localize;

  let activities = $derived.by(() => {
    return item
      ? Activities.getVisibleActivities(
          item,
          item.system.activities,
        ).map<ActivityItemContext>((activity) =>
          Activities.getActivityItemContext(
            context.document.sheet,
            activity,
            context.unlocked,
            context.editable,
          ),
        )
      : [];
  });
</script>

{#if activities.length > 0 && settings.value.inlineActivitiesPosition === CONSTANTS.INLINE_ACTIVITIES_POSITION_TOP}
  <InlineActivitiesList {item} {activities} />
{/if}
<div
  class="item-summary"
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
  {/if}

  <div data-target="system.description.value" data-uuid={item.uuid}>
    {#if showGmUnidentifiedDescription}
      {#await FoundryAdapter.enrichHtml(item.system.unidentified.description, enrichmentOptions) then enriched}
        <div
          class="item-summary-unidentified"
          data-target="system.unidentified.description"
          data-uuid={item.uuid}
        >
          {@html enriched}
        </div>
      {/await}
    {/if}
    {@html chatData.description}
  </div>

  <ItemSummaryCommandButtonList {item} />

  {#if chatData.properties}
    <div
      class="inline-wrapped-elements"
      class:conceal-content={concealDetails}
      data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_PROPERTY_LIST}
    >
      {#each chatData.properties as prop}
        <span class="tag">
          <span class="value">{prop}</span>
        </span>
      {/each}
      {#each additionalItemProps as prop}
        <PropertyTag {prop} showParenthetical={true} />
      {/each}
    </div>
  {/if}
</div>
{#if activities.length && settings.value.inlineActivitiesPosition === CONSTANTS.INLINE_ACTIVITIES_POSITION_BOTTOM}
  <InlineActivitiesList {item} {activities} />
{/if}
