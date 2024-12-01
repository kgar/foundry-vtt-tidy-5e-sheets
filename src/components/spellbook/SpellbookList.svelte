<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import {
    type CharacterSheetContext,
    type NpcSheetContext,
    type RenderableClassicControl,
    type SpellbookSection,
  } from 'src/types/types';
  import ItemEditControl from '../item-list/controls/ItemEditControl.svelte';
  import ItemName from '../item-list/ItemName.svelte';
  import ItemTable from '../item-list/v1/ItemTable.svelte';
  import ItemTableCell from '../item-list/v1/ItemTableCell.svelte';
  import ItemTableColumn from '../item-list/v1/ItemTableColumn.svelte';
  import ItemTableFooter from '../item-list/ItemTableFooter.svelte';
  import ItemTableHeaderRow from '../item-list/v1/ItemTableHeaderRow.svelte';
  import ItemTableRow from '../item-list/v1/ItemTableRow.svelte';
  import ItemUseButton from '../item-list/ItemUseButton.svelte';
  import ItemUses from '../item-list/ItemUses.svelte';
  import SpellComponents from './SpellComponents.svelte';
  import SpellPrepareControl from '../spellbook/SpellPrepareControl.svelte';
  import InlineFavoriteIcon from '../item-list/InlineFavoriteIcon.svelte';
  import ItemFavoriteControl from '../item-list/controls/ItemFavoriteControl.svelte';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import { settingStore } from 'src/settings/settings';
  import ActionFilterOverrideControl from '../item-list/controls/ActionFilterOverrideControl.svelte';
  import { SpellSchool } from 'src/features/spell-school/SpellSchool';
  import { declareLocation } from 'src/types/location-awareness.types';
  import Dnd5eIcon from '../icon/Dnd5eIcon.svelte';
  import SpellSlotManagement from './SpellSlotManagement.svelte';
  import type { Item5e } from 'src/types/item.types';
  import ClassicControls from 'src/sheets/classic/shared/ClassicControls.svelte';
  import ConcentrationOverlayIcon from './ConcentrationOverlayIcon.svelte';
  import DeleteOrOpenActivity from '../item-list/controls/DeleteOrOpenActivity.svelte';
  import ActivityUses from '../item-list/ActivityUses.svelte';
  import InlineToggleControl from 'src/sheets/classic/shared/InlineToggleControl.svelte';
  import { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService';
  import InlineActivitiesList from 'src/components/item-list/InlineActivitiesList.svelte';

  let context = getContext<Readable<CharacterSheetContext | NpcSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  interface Props {
    section: SpellbookSection;
    spells: any[];
    allowFavorites?: boolean;
    cssClass?: string | null;
    // TODO: replace this with column specification array default and then allow the caller to customize the table.
    includeSchool?: boolean;
    includeRange?: boolean;
    spellComponentsBaseWidth?: string;
    targetBaseWidth?: string;
    usageBaseWidth?: string;
  }

  let {
    section,
    spells,
    allowFavorites = true,
    cssClass = null,
    includeSchool = true,
    includeRange = true,
    spellComponentsBaseWidth = '3.75rem',
    targetBaseWidth = '7.5rem',
    usageBaseWidth = '7.5rem',
  }: Props = $props();

  let inlineToggleService = getContext<InlineToggleService>(
    CONSTANTS.SVELTE_CONTEXT.INLINE_TOGGLE_SERVICE,
  );

  let itemIdsToShow = getContext<Readable<Set<string> | undefined>>(
    CONSTANTS.SVELTE_CONTEXT.ITEM_IDS_TO_SHOW,
  );

  var spellSchoolBaseWidth = '2rem';

  let controls: RenderableClassicControl<{ item: Item5e; ctx: any }>[] =
    $derived.by(() => {
      let result: RenderableClassicControl<{ item: Item5e; ctx: any }>[] = [
        {
          component: SpellPrepareControl,
          props: ({ item, ctx }) => ({
            spell: item,
            ctx,
          }),
          visible: ({ item }) => FoundryAdapter.canPrepareSpell(item),
        },
      ];

      if (allowFavorites) {
        result.push({
          component: ItemFavoriteControl,
          props: ({ item }) => ({
            item,
          }),
        });
      }

      result.push({
        component: ItemEditControl,
        props: ({ item }) => ({
          item,
        }),
      });

      if ($context.unlocked) {
        result.push({
          // svelte 5 - snippet?
          component: DeleteOrOpenActivity,
          props: ({ item }) => ({
            item,
          }),
        });
      }

      if ($context.useActionsFeature) {
        result.push({
          component: ActionFilterOverrideControl,
          props: ({ item }) => ({
            item,
          }),
        });
      }

      return result;
    });

  const localize = FoundryAdapter.localize;

  let classicControlsColumnWidth = $derived(`${controls.length * 1.25}rem`);

  declareLocation('spellbook-list-view');
</script>

<section class="spellbook-list-section {cssClass}">
  <ItemTable
    key={section.key}
    data-custom-section={section.custom ? true : null}
  >
    {#snippet header()}
      <ItemTableHeaderRow>
        <ItemTableColumn primary={true}>
          <span class="spell-primary-column-label">
            {localize(section.label)}
          </span>
          {#if section.usesSlots}
            <SpellSlotManagement {section} />
          {/if}
        </ItemTableColumn>
        <ItemTableColumn
          baseWidth={spellComponentsBaseWidth}
          title={localize('DND5E.SpellComponents')}
        >
          <i class="fas fa-mortar-pestle"></i>
        </ItemTableColumn>
        {#if includeSchool}
          <ItemTableColumn
            baseWidth={spellSchoolBaseWidth}
            title={localize('DND5E.SpellSchool')}
          >
            <i class="fas fa-hat-wizard"></i>
          </ItemTableColumn>
        {/if}
        <ItemTableColumn
          baseWidth={targetBaseWidth}
          title={localize('DND5E.SpellTarget')}
        >
          {localize('DND5E.Target')}
        </ItemTableColumn>
        {#if includeRange}
          <ItemTableColumn baseWidth="4.375rem" title={localize('DND5E.Range')}>
            {localize('DND5E.Range')}
          </ItemTableColumn>
        {/if}
        <ItemTableColumn
          title={localize('DND5E.SpellUsage')}
          baseWidth={usageBaseWidth}
        >
          {localize('DND5E.Usage')}
        </ItemTableColumn>
        {#if $context.editable && $context.useClassicControls}
          <ItemTableColumn baseWidth={classicControlsColumnWidth} />
        {/if}
      </ItemTableHeaderRow>
    {/snippet}
    {#snippet body()}
      {#each spells as spell (spell.id)}
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
          cssClass={FoundryAdapter.getSpellRowClasses(spell)}
          hidden={!!$itemIdsToShow && !$itemIdsToShow.has(spell.id)}
        >
          {#snippet children({ toggleSummary })}
            <ItemTableCell primary={true}>
              <ItemUseButton
                disabled={!$context.editable}
                item={spell}
                imgUrlOverride={spellImgUrl}
                showDiceIconOnHover={!ctx.concentration}
              >
                {#snippet afterRollButton()}
                  <ConcentrationOverlayIcon {ctx} />
                {/snippet}
              </ItemUseButton>
              {#if spell?.system.activities?.contents.length > 1}
                <InlineToggleControl
                  entityId={spell.id}
                  {inlineToggleService}
                />
              {/if}
              <ItemName
                onToggle={() => toggleSummary($context.actor)}
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
            {#if spell.hasLimitedUses}
              <ItemTableCell baseWidth="3.125rem">
                <ItemUses item={spell} />
              </ItemTableCell>
            {:else if (spell.system.linkedActivity?.uses?.max ?? 0) > 0}
              <ItemTableCell baseWidth="3.125rem">
                <ActivityUses activity={spell.system.linkedActivity} />
              </ItemTableCell>
            {/if}
            {#if allowFavorites && $settingStore.showIconsNextToTheItemName && 'favoriteId' in ctx && !!ctx.favoriteId}
              <InlineFavoriteIcon />
            {/if}
            <ItemTableCell
              baseWidth={spellComponentsBaseWidth}
              cssClass="no-gap"
            >
              <SpellComponents
                {spell}
                spellComponentLabels={$context.spellComponentLabels}
              />
            </ItemTableCell>
            {#if includeSchool}
              {@const icon = SpellSchool.getIcon(spell.system.school)}
              <ItemTableCell
                baseWidth={spellSchoolBaseWidth}
                title={spell.labels.school ?? ''}
              >
                {#if typeof icon === 'string'}
                  <i class="spell-school-icon {icon}"></i>
                {:else}
                  <Dnd5eIcon
                    --icon-fill="var(--t5e-secondary-color)"
                    --icon-width="1rem"
                    --icon-height="1rem"
                    src={icon.iconSrc}
                  />
                {/if}
              </ItemTableCell>
            {/if}
            <ItemTableCell
              baseWidth={targetBaseWidth}
              title="{localize('DND5E.Target')}: {spell.labels.target}"
            >
              {#if spell.labels.target}
                {spell.labels.target}
              {:else}
                {localize('DND5E.None')}
              {/if}
            </ItemTableCell>
            {#if includeRange}
              <ItemTableCell
                baseWidth="4.375rem"
                title="{localize('DND5E.Range')}: {spell.labels.range}"
              >
                {spell.labels.range}
              </ItemTableCell>
            {/if}
            <ItemTableCell
              baseWidth={usageBaseWidth}
              title={localize('DND5E.SpellUsage')}
            >
              {spell.labels.activation}
            </ItemTableCell>
            {#if $context.editable && $context.useClassicControls}
              <ItemTableCell baseWidth={classicControlsColumnWidth}>
                <ClassicControls
                  {controls}
                  params={{ item: spell, ctx: ctx }}
                />
              </ItemTableCell>
            {/if}
          {/snippet}
        </ItemTableRow>
        {#if spell?.system.activities?.contents.length > 1}
          <InlineActivitiesList item={spell} {inlineToggleService} />
        {/if}
      {/each}
      {#if $context.unlocked}
        <ItemTableFooter
          actor={$context.actor}
          {section}
          canCreate={section.canCreate}
          isItem={true}
        />
      {/if}
    {/snippet}
  </ItemTable>
</section>

<style lang="scss">
  .spell-primary-column-label {
    font-size: 0.75rem;
    line-height: 0.75rem;
    flex: 0 0 3.75rem;
    white-space: nowrap;
  }

  .spellbook-list-section {
    .spell-school-icon {
      color: var(--t5e-secondary-color);
      font-size: 1rem;
      margin: 0;
      padding: 0;
    }
  }
</style>
