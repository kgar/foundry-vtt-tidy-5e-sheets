<script lang="ts">
  import type { Item5e } from 'src/types/item.types';
  import HorizontalLineSeparator from '../../layout/HorizontalLineSeparator.svelte';
  import { CONSTANTS } from 'src/constants';
  import ItemSummaryCommandButtonList from '../../item-summary/ItemSummaryCommandButtonList.svelte';
  import { ItemSummaryRuntime } from 'src/runtime/ItemSummaryRuntime';
  import { ItemProperties } from 'src/features/properties/ItemProperties.svelte';
  import PropertyTag from 'src/components/properties/PropertyTag.svelte';

  interface Props {
    item: Item5e;
    chatData: any | undefined;
  }

  let { item, chatData }: Props = $props();

  let specialProps = $derived(getSpecialProperties(item));
  let additionalItemProps = $derived(
    ItemProperties.getAdditionalItemProperties(item),
  );
  let itemProps = $derived(chatData?.properties ?? []);
  let itemSummaryCommands = $derived(
    ItemSummaryRuntime.getItemSummaryCommands(item),
  );

  function getSpecialProperties(item: Item5e | undefined): string[] {
    const props: string[] = [];

    if (item?.labels?.toHit) {
      props.push(item.labels.toHit.replace('+ ', '+').replace('- ', '-'));
    }
    if (item?.labels?.damage && item.labels?.damages?.length > 0) {
      props.push(
        item.labels.damages?.[0].label.replace(' + ', '+').replace(' - ', '-'),
      );
    }
    if (item?.labels?.save) {
      props.push(item.labels.save);
    }

    return props;
  }
</script>

{#if specialProps.length}
  <HorizontalLineSeparator />
  <div
    class="inline-wrapped-elements"
    data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_PROPERTY_LIST}
  >
    {#each specialProps as prop}
      <span class="tag">{prop}</span>
    {/each}
  </div>
{/if}
{#if itemProps.length || additionalItemProps.length}
  <HorizontalLineSeparator />
  <div
    class="inline-wrapped-elements"
    data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_PROPERTY_LIST}
  >
    {#each itemProps as prop}
      <span class="tag">
        <span class="value">{prop}</span>
      </span>
    {/each}
    {#each additionalItemProps as prop}
      <PropertyTag {prop} showParenthetical={true} />
    {/each}
  </div>
{/if}
{#if itemSummaryCommands.length}
  <HorizontalLineSeparator />
  <div class="inline-wrapped-elements">
    <ItemSummaryCommandButtonList {item} />
  </div>
{/if}
