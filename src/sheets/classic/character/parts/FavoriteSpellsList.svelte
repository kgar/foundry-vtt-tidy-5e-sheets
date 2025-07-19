<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { type SpellbookSection } from 'src/types/types';
  import ItemName from '../../../../components/item-list/ItemName.svelte';
  import ItemTable from '../../../../components/item-list/v1/ItemTable.svelte';
  import ItemTableCell from '../../../../components/item-list/v1/ItemTableCell.svelte';
  import ItemTableColumn from '../../../../components/item-list/v1/ItemTableColumn.svelte';
  import ItemTableHeaderRow from '../../../../components/item-list/v1/ItemTableHeaderRow.svelte';
  import ItemTableRow from '../../../../components/item-list/v1/ItemTableRow.svelte';
  import ItemUseButton from '../../../../components/item-list/ItemUseButton.svelte';
  import ItemUses from '../../../../components/item-list/ItemUses.svelte';
  import SpellComponents from '../../../../components/spellbook/SpellComponents.svelte';
  import { getContext } from 'svelte';
  import SpellSlotManagement from 'src/components/spellbook/SpellSlotManagement.svelte';
  import ConcentrationOverlayIcon from 'src/components/spellbook/ConcentrationOverlayIcon.svelte';
  import { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
  import { getSearchResultsContext } from 'src/features/search/search.svelte';
  import { getCharacterSheetContext } from 'src/sheets/sheet-context.svelte';
  import ActivityUses from 'src/components/item-list/ActivityUses.svelte';
  import { ItemVisibility } from 'src/features/sections/ItemVisibility';

  interface Props {
    section: SpellbookSection;
  }

  let { section }: Props = $props();

  let inlineToggleService = getContext<InlineToggleService>(
    CONSTANTS.SVELTE_CONTEXT.INLINE_TOGGLE_SERVICE,
  );

  let context = $derived(getCharacterSheetContext());

  let spellEntries = $derived(
    section.spells.map((spell) => ({
      spell,
      ctx: context.itemContext[spell.id],
      spellImgUrl: FoundryAdapter.getSpellImageUrl(context, spell),
    })),
  );

  const searchResults = getSearchResultsContext();

  const localize = FoundryAdapter.localize;
</script>

<section class="spellbook-list-section">
  <ItemTable
    key={section.key}
    data-custom-section={section.custom ? true : null}
  >
    {#snippet header()}
      {@const visibleItemCount = ItemVisibility.countVisibleItems(
        section.spells,
        searchResults.uuids,
      )}
      <ItemTableHeaderRow>
        <ItemTableColumn primary={true}>
          {#if CONFIG.DND5E.spellcasting[section.dataset['method']]?.prepares && section.dataset.level > 0}
            {localize('TIDY5E.FavoriteSpellLevelLabel', {
              number: section.dataset.level,
            })}
          {:else}
            <span class="spell-primary-column-label">
              {localize(section.label)}
            </span>
          {/if}
          <span class="item-table-count">{visibleItemCount}</span>
          {#if section.usesSlots}
            <SpellSlotManagement {section} />
          {/if}
        </ItemTableColumn>
        <ItemTableColumn
          baseWidth="4.375rem"
          title={localize('DND5E.SpellComponents')}
        >
          <i class="fas fa-mortar-pestle"></i>
        </ItemTableColumn>
        <ItemTableColumn
          title={localize('DND5E.SpellUsage')}
          baseWidth="7.5rem"
        >
          {localize('DND5E.Usage')}
        </ItemTableColumn>
      </ItemTableHeaderRow>
    {/snippet}
    {#snippet body()}
      {#each spellEntries as { spell, ctx, spellImgUrl } (spell.id)}
        <ItemTableRow
          item={spell}
          onMouseDown={(event) =>
            FoundryAdapter.editOnMiddleClick(event, spell)}
          contextMenu={{
            type: CONSTANTS.CONTEXT_MENU_TYPE_ITEMS,
            uuid: spell.uuid,
          }}
          cssClass={FoundryAdapter.getSpellRowClasses(spell)}
          hidden={!searchResults.show(spell.uuid)}
          favoriteId={ctx.favoriteId}
        >
          {#snippet children({ toggleSummary })}
            <ItemTableCell primary={true}>
              <ItemUseButton
                disabled={!context.editable}
                item={spell}
                imgUrlOverride={spellImgUrl}
              >
                {#snippet afterRollButton()}
                  <ConcentrationOverlayIcon {ctx} />
                {/snippet}
              </ItemUseButton>
              <ItemName
                onToggle={() => toggleSummary(context.actor)}
                item={spell}
              >
                <span
                  class="truncate flex-1"
                  data-tidy-item-name={spell.name}
                  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_NAME}
                  >{spell.name}</span
                >
              </ItemName>
              {#if ctx.hasUses}
                <div class="primary-cell-uses">
                  <ItemUses item={spell} />
                </div>
              {:else if ctx.linkedUses}
                <div class="primary-cell-uses">
                  <div class="inline-item-uses">
                    <span class="uses-value">
                      {ctx.linkedUses.value}
                    </span>
                    /
                    <span class="uses-max">
                      {ctx.linkedUses.max}
                    </span>
                  </div>
                </div>
              {:else if (spell.system.linkedActivity?.uses?.max ?? 0) > 0}
                <span class="primary-cell-uses">
                  <ActivityUses activity={spell.system.linkedActivity} />
                </span>
              {/if}
            </ItemTableCell>
            <ItemTableCell baseWidth="4.375rem" cssClass="no-gap">
              <SpellComponents
                {spell}
                spellComponentLabels={context.spellComponentLabels}
              />
            </ItemTableCell>
            <ItemTableCell
              baseWidth="7.5rem"
              title={localize('DND5E.SpellUsage')}
            >
              {spell.labels.activation}
            </ItemTableCell>
          {/snippet}
        </ItemTableRow>
      {/each}
    {/snippet}
  </ItemTable>
</section>

<style lang="scss">
  .spell-primary-column-label {
    font-size: 0.75rem;
    line-height: 0.75rem;
    flex: 0 0 auto;
    white-space: nowrap;
  }
</style>
