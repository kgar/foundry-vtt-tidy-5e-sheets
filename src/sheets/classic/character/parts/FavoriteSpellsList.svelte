<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import {
    type CharacterSheetContext,
    type SpellbookSection,
  } from 'src/types/types';
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
  import type { Readable } from 'svelte/store';
  import SpellSlotManagement from 'src/components/spellbook/SpellSlotManagement.svelte';
  import ConcentrationOverlayIcon from 'src/components/spellbook/ConcentrationOverlayIcon.svelte';
  import InlineActivitiesList from 'src/components/item-list/InlineActivitiesList.svelte';
  import InlineToggleControl from 'src/sheets/classic/shared/InlineToggleControl.svelte';
  import { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService';

  let inlineToggleService = getContext<InlineToggleService>(
    CONSTANTS.SVELTE_CONTEXT.INLINE_TOGGLE_SERVICE,
  );

  let context = getContext<Readable<CharacterSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );
  export let section: SpellbookSection;
  export let spells: any[];

  let itemIdsToShow = getContext<Readable<Set<string> | undefined>>(
    CONSTANTS.SVELTE_CONTEXT.ITEM_IDS_TO_SHOW,
  );

  const localize = FoundryAdapter.localize;
</script>

<section class="spellbook-list-section">
  <ItemTable
    key={section.key}
    data-custom-section={section.custom ? true : null}
  >
    <svelte:fragment slot="header">
      <ItemTableHeaderRow>
        <ItemTableColumn primary={true}>
          {#if section.dataset['preparation.mode'] === CONSTANTS.SPELL_PREPARATION_MODE_PREPARED && section.dataset.level > 0}
            {localize('TIDY5E.FavoriteSpellLevelLabel', {
              number: section.dataset.level,
            })}
          {:else}
            <span class="spell-primary-column-label">
              {localize(section.label)}
            </span>
          {/if}
          {#if section.usesSlots}
            <SpellSlotManagement {section} />
          {/if}
        </ItemTableColumn>
        <ItemTableColumn
          baseWidth="4.375rem"
          title={localize('DND5E.SpellComponents')}
        >
          <i class="fas fa-mortar-pestle" />
        </ItemTableColumn>
        <ItemTableColumn
          title={localize('DND5E.SpellUsage')}
          baseWidth="7.5rem"
        >
          {localize('DND5E.Usage')}
        </ItemTableColumn>
      </ItemTableHeaderRow>
    </svelte:fragment>
    <svelte:fragment slot="body">
      {#each spells as spell}
        {@const ctx = $context.itemContext[spell.id]}
        {@const spellImgUrl = FoundryAdapter.getSpellImageUrl($context, spell)}
        <ItemTableRow
          item={spell}
          on:mousedown={(event) =>
            FoundryAdapter.editOnMiddleClick(event.detail, spell)}
          contextMenu={{
            type: CONSTANTS.CONTEXT_MENU_TYPE_ITEMS,
            uuid: spell.uuid,
          }}
          let:toggleSummary
          cssClass={FoundryAdapter.getSpellRowClasses(spell)}
          hidden={!!$itemIdsToShow && !$itemIdsToShow.has(spell.id)}
          favoriteId={ctx.favoriteId}
        >
          <ItemTableCell primary={true}>
            <ItemUseButton
              disabled={!$context.editable}
              item={spell}
              imgUrlOverride={spellImgUrl}
            >
              <svelte:fragment slot="after-roll-button">
                <ConcentrationOverlayIcon {ctx} />
              </svelte:fragment>
            </ItemUseButton>
            {#if spell?.system.activities?.contents.length > 1}
              <InlineToggleControl entityId={spell.id} {inlineToggleService} />
            {/if}
            <ItemName
              on:toggle={() => toggleSummary($context.actor)}
              item={spell}
            >
              <span
                class="truncate"
                data-tidy-item-name={spell.name}
                data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_NAME}
                >{spell.name}</span
              >
            </ItemName>
          </ItemTableCell>
          {#if spell.system.uses.per}
            <ItemTableCell baseWidth="3.125rem">
              <ItemUses item={spell} />
            </ItemTableCell>
          {/if}
          <ItemTableCell baseWidth="4.375rem" cssClass="no-gap">
            <SpellComponents
              {spell}
              spellComponentLabels={$context.spellComponentLabels}
            />
          </ItemTableCell>
          <ItemTableCell
            baseWidth="7.5rem"
            title={localize('DND5E.SpellUsage')}
          >
            {spell.labels.activation}
          </ItemTableCell>
        </ItemTableRow>
        {#if spell?.system.activities?.contents.length > 1}
          <InlineActivitiesList item={spell} {inlineToggleService} />
        {/if}
      {/each}
    </svelte:fragment>
  </ItemTable>
</section>

<style lang="scss">
  .spell-primary-column-label {
    font-size: 0.75rem;
    line-height: 0.75rem;
    flex: 0 0 3.75rem;
    white-space: nowrap;
  }
</style>
