<script lang="ts">
  import type { Item5e } from 'src/types/item.types';
  import type {
    CharacterFeatureSection,
    CharacterSheetContext,
  } from 'src/types/types';
  import ItemTable from '../../../../components/item-list/v1/ItemTable.svelte';
  import ItemTableHeaderRow from '../../../../components/item-list/v1/ItemTableHeaderRow.svelte';
  import ItemTableColumn from '../../../../components/item-list/v1/ItemTableColumn.svelte';
  import ItemTableRow from '../../../../components/item-list/v1/ItemTableRow.svelte';
  import ItemTableCell from '../../../../components/item-list/v1/ItemTableCell.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { CONSTANTS } from 'src/constants';
  import ItemAddUses from '../../../../components/item-list/ItemAddUses.svelte';
  import ItemName from '../../../../components/item-list/ItemName.svelte';
  import ItemUseButton from '../../../../components/item-list/ItemUseButton.svelte';
  import ItemUses from '../../../../components/item-list/ItemUses.svelte';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import RechargeControl from 'src/components/item-list/controls/RechargeControl.svelte';
  import { ItemUtils } from 'src/utils/ItemUtils';
  import InlineActivitiesList from 'src/components/item-list/InlineActivitiesList.svelte';
  import type { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService';
  import InlineToggleControl from 'src/sheets/classic/shared/InlineToggleControl.svelte';

  let context = getContext<Readable<CharacterSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );
  interface Props {
    items?: Item5e[];
    section: CharacterFeatureSection;
  }

  let { items = [], section }: Props = $props();

  let itemIdsToShow = getContext<Readable<Set<string> | undefined>>(
    CONSTANTS.SVELTE_CONTEXT.ITEM_IDS_TO_SHOW,
  );

  let inlineToggleService = getContext<InlineToggleService>(
    CONSTANTS.SVELTE_CONTEXT.INLINE_TOGGLE_SERVICE,
  );

  const localize = FoundryAdapter.localize;
</script>

<ItemTable key={section.key} data-custom-section={section.custom ? true : null}>
  {#snippet header()}
    <ItemTableHeaderRow>
      <ItemTableColumn primary={true}>
        {localize(section.label ?? 'DND5E.Features')}
      </ItemTableColumn>
      <ItemTableColumn baseWidth="3.125rem">
        {localize('DND5E.Uses')}
      </ItemTableColumn>
      <ItemTableColumn baseWidth="7.5rem">
        {localize('DND5E.Usage')}
      </ItemTableColumn>
    </ItemTableHeaderRow>
  {/snippet}
  {#snippet body()}
    {#each items as item (item.id)}
      {@const ctx = $context.itemContext[item.id]}
      <ItemTableRow
        {item}
        onMouseDown={(event) => FoundryAdapter.editOnMiddleClick(event, item)}
        contextMenu={{
          type: CONSTANTS.CONTEXT_MENU_TYPE_ITEMS,
          uuid: item.uuid,
        }}
        hidden={!!$itemIdsToShow && !$itemIdsToShow.has(item.id)}
        favoriteId={ctx.favoriteId}
      >
        {#snippet children({ toggleSummary })}
          <ItemTableCell primary={true}>
            <ItemUseButton disabled={!$context.editable} {item} />
            {#if item?.system.activities?.contents.length > 1}
              <InlineToggleControl entityId={item.id} {inlineToggleService} />
            {/if}
            <ItemName
              onToggle={() => toggleSummary($context.actor)}
              hasChildren={false}
              {item}
            >
              <span
                data-tidy-item-name={item.name}
                data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_NAME}
                >{item.name}</span
              >
            </ItemName>
          </ItemTableCell>
          <ItemTableCell baseWidth="3.125rem">
            {#if item.isOnCooldown}
              <RechargeControl {item} />
            {:else if item.hasRecharge}
              <i class="fas fa-bolt" title={localize('DND5E.Charged')}></i>
            {:else if ctx?.hasUses}
              <ItemUses {item} />
            {:else}
              <ItemAddUses {item} />
            {/if}
          </ItemTableCell>
          <ItemTableCell baseWidth="7.5rem">
            {#if ItemUtils.hasActivationType(item)}
              {item.labels?.activation ?? ''}
            {/if}
          </ItemTableCell>
        {/snippet}
      </ItemTableRow>
      {#if item?.system.activities?.contents.length > 1}
        <InlineActivitiesList {item} {inlineToggleService} />
      {/if}
    {/each}
  {/snippet}
</ItemTable>
