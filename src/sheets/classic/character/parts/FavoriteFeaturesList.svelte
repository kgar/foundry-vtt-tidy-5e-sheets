<script lang="ts">
  import type { CharacterFeatureSection } from 'src/types/types';
  import ItemTable from '../../../../components/item-list/v1/ItemTable.svelte';
  import ItemTableHeaderRow from '../../../../components/item-list/v1/ItemTableHeaderRow.svelte';
  import ItemTableColumn from '../../../../components/item-list/v1/ItemTableColumn.svelte';
  import ItemTableRow from '../../../../components/item-list/v1/ItemTableRow.svelte';
  import ItemTableCell from '../../../../components/item-list/v1/ItemTableCell.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { CONSTANTS } from 'src/constants';
  import ItemName from '../../../../components/item-list/ItemName.svelte';
  import ItemUseButton from '../../../../components/item-list/ItemUseButton.svelte';
  import ItemUses from '../../../../components/item-list/ItemUses.svelte';
  import { getContext } from 'svelte';
  import RechargeControl from 'src/components/item-list/controls/RechargeControl.svelte';
  import { ItemUtils } from 'src/utils/ItemUtils';
  import type { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
  import { getSearchResultsContext } from 'src/features/search/search.svelte';
  import { getCharacterSheetContext } from 'src/sheets/sheet-context.svelte';
  import { ItemVisibility } from 'src/features/sections/ItemVisibility';

  interface Props {
    section: Omit<CharacterFeatureSection, 'type'>;
  }

  let { section }: Props = $props();

  let context = $derived(getCharacterSheetContext());

  let itemEntries = $derived(
    section.items.map((item) => ({ item, ctx: context.itemContext[item.id] })),
  );

  const searchResults = getSearchResultsContext();

  let inlineToggleService = getContext<InlineToggleService>(
    CONSTANTS.SVELTE_CONTEXT.INLINE_TOGGLE_SERVICE,
  );

  const localize = FoundryAdapter.localize;
</script>

<ItemTable key={section.key} data-custom-section={section.custom ? true : null}>
  {#snippet header()}
    {@const visibleItemCount = ItemVisibility.countVisibleItems(
      section.items,
      searchResults.uuids,
    )}
    <ItemTableHeaderRow>
      <ItemTableColumn primary={true}>
        {localize(section.label ?? 'DND5E.Features')}
        <span class="item-table-count">{visibleItemCount}</span>
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
    {#each itemEntries as { item, ctx } (item.id)}
      <ItemTableRow
        {item}
        onMouseDown={(event) => FoundryAdapter.editOnMiddleClick(event, item)}
        contextMenu={{
          type: CONSTANTS.CONTEXT_MENU_TYPE_ITEMS,
          uuid: item.uuid,
        }}
        hidden={!searchResults.show(item.uuid)}
        favoriteId={ctx.favoriteId}
      >
        {#snippet children({ toggleSummary })}
          <ItemTableCell primary={true}>
            <ItemUseButton disabled={!context.editable} {item} />
            <ItemName
              onToggle={() => toggleSummary(context.actor)}
              hasChildren={false}
              {item}
            >
              <span
                data-tidy-item-name={item.name}
                data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_NAME}
                class="truncate flex-1">{item.name}</span
              >
            </ItemName>
          </ItemTableCell>
          <ItemTableCell baseWidth="3.125rem">
            {#if item.isOnCooldown}
              <RechargeControl
                document={item}
                field={'system.uses.spent'}
                uses={item.system.uses}
              />
            {:else if item.hasRecharge}
              {@const remaining = item.system.uses.max - item.system.uses.spent}
              {#if remaining > 1}
                <span>{remaining}</span>
              {/if}
              <i class="fas fa-bolt" title={localize('DND5E.Charged')}></i>
            {:else if ctx?.hasUses}
              <ItemUses {item} />
            {:else}
              <span class="text-body-tertiary">&mdash;</span>
            {/if}
          </ItemTableCell>
          <ItemTableCell baseWidth="7.5rem">
            {#if ItemUtils.hasActivationType(item)}
              {item.labels?.activation ?? ''}
            {/if}
          </ItemTableCell>
        {/snippet}
      </ItemTableRow>
    {/each}
  {/snippet}
</ItemTable>
