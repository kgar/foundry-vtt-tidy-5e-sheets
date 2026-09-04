<script lang="ts">
  import ItemSummaryCommandButtonList from '../item-summary/ItemSummaryCommandButtonList.svelte';
  import type { Item5e, ItemChatData } from 'src/types/item.types';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { CONSTANTS } from 'src/constants';
  import { Enrichers } from 'src/features/enrichers/Enrichers';
  import TidyInlineActivitiesList from './TidyInlineActivitiesList.svelte';
  import TidyInlineEffectsList from './TidyInlineEffectsList.svelte';
  import { Activities } from 'src/features/activities/activities';
  import type { ActivityItemContext } from 'src/types/types';
  import { settings } from 'src/settings/settings.svelte';
  import { ItemProperties } from 'src/features/properties/ItemProperties.svelte';
  import PropertyTag from '../properties/PropertyTag.svelte';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { Snippet } from 'svelte';

  interface Props {
    chatData: ItemChatData;
    item?: Item5e | undefined;
    afterInlineActivities?: Snippet<[Item5e | undefined, any | undefined]>;
    ctx?: any;
  }

  let { chatData, item, afterInlineActivities, ctx }: Props = $props();

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
        ).map<ActivityItemContext>((activity) =>
          Activities.getActivityItemContext(
            context.sheet,
            activity,
            context.unlocked,
            context.editable,
          ),
        )
      : [];
  });

  let identified = $derived(item.system.identified !== false);

  let context = $derived(getSheetContext());

  let isGm = $derived(FoundryAdapter.userIsGm());
  let gmEditMode = $derived(FoundryAdapter.isInGmEditMode(context.document));
  let showGmOnlyUi = $derived(!identified && gmEditMode);
  let unidentifiedDescription = $derived(item.system.unidentified?.description);
  let showGmUnidentifiedDescription = $derived(
    isGm && !identified && !!unidentifiedDescription,
  );
  let showGmSecretDescription = $derived(
    isGm && !identified && !gmEditMode,
  );
  let enrichmentOptions = $derived({
    relativeTo: item,
    rollData: item.getRollData(),
    secrets: item.isOwner,
  });
</script>

{#if settings.value.inlineActivitiesPosition === CONSTANTS.INLINE_ACTIVITIES_POSITION_TOP}
  {#if activities.length > 0}
    <TidyInlineActivitiesList {item} {activities} />
  {/if}
  {@render afterInlineActivities?.(item, ctx)}
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

  <div class={['user-select-text', { callout: showGmOnlyUi }]}>
    {#if !identified}
      <span class="color-text-lightest font-default-longform unidentified-notice">
        {localize('DND5E.Unidentified.Notice')}
      </span>
    {/if}
    {#if showGmUnidentifiedDescription}
      <div class={['item-summary-unidentified', { callout: showGmOnlyUi }]}>
        {#await FoundryAdapter.enrichHtml(unidentifiedDescription, enrichmentOptions) then enriched}
            {@html enriched}
        {/await}
      </div>
    {/if}
    <div data-target="system.description.value" data-uuid={item.uuid} class={{ 'secret-block': showGmSecretDescription }}>
      {#if showGmSecretDescription}
        <div class="gm-only">
          {localize(
            'TIDY5E.WorldSettings.ItemIdentificationPermission.options.GmOnly',
          )}
        </div>
      {/if}
      {@html chatData.description}
    </div>

  </div>
  
  <TidyInlineEffectsList {item} />

  <div
    class="inline-wrapped-elements user-select-text"
    data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_PROPERTY_LIST}
  >
    <div class="left-aligned-elements">
      {#if chatData.properties && (gmEditMode || identified)}
        {#each chatData.properties as prop}<span class="tag">
            <span class="value">
              {prop.capitalize()}
            </span>
          </span>
        {/each}
        {#each additionalItemProps as prop}
          <PropertyTag {prop} showParenthetical={true} />
        {/each}
      {/if}
    </div>
    <div class="right-aligned-elements">
      <ItemSummaryCommandButtonList {item} />
    </div>
  </div>
</div>
{#if settings.value.inlineActivitiesPosition === CONSTANTS.INLINE_ACTIVITIES_POSITION_BOTTOM}
  {#if activities.length > 0}
    <TidyInlineActivitiesList {item} {activities} />
  {/if}
  {@render afterInlineActivities?.(item, ctx)}
{/if}
