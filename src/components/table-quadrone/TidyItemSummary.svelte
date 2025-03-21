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
  import PropertyTag from '../properties/PropertyTag.svelte';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';

  interface Props {
    chatData: ItemChatData;
    item?: Item5e | undefined;
  }

  let { chatData, item }: Props = $props();

  let itemSummaryCommands = $derived(
    ItemSummaryRuntime.getItemSummaryCommands(item),
  );

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

  let identified = $derived(item.system.identified !== false);

  let context = $derived(getSheetContext());

  let gmEditMode = $derived(FoundryAdapter.isInGmEditMode(context.document));

  let showGmOnlyUi = $derived(!identified && gmEditMode);
</script>

{#if activities.length > 0 && settings.value.inlineActivitiesPosition === CONSTANTS.INLINE_ACTIVITIES_POSITION_TOP}
  <TidyInlineActivitiesList {item} {activities} />
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
  {/if}

  <div class={{ callout: showGmOnlyUi }}>
    {#if showGmOnlyUi}
      <div class="gm-only color-text-lighter">
        {localize(
          'TIDY5E.WorldSettings.ItemIdentificationPermission.options.GmOnly',
        )}
      </div>
    {/if}
    {@html chatData.description}
  </div>

  <div
    class="inline-wrapped-elements"
    data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_PROPERTY_LIST}
  >
    <div class="left-aligned-elements">
      {#if chatData.properties && (gmEditMode || identified)}
        {#each chatData.properties as prop}<span class="tag">
            <span class="value">
              {prop}
            </span>
          </span>
        {/each}
        {#each additionalItemProps as prop}
          <PropertyTag {prop} showParenthetical={true} />
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
