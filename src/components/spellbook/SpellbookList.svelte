<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import {
    type CharacterSheetContext,
    type NpcSheetContext,
    type RenderableClassicControl,
  } from 'src/types/types';
  import ItemDeleteControl from '../item-list/controls/ItemDeleteControl.svelte';
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
  import ClassicControls from 'src/sheets/shared/ClassicControls.svelte';

  let context =
    getContext<Readable<CharacterSheetContext | NpcSheetContext>>('context');
  export let section: any;
  export let spells: any[];
  export let allowFavorites: boolean = true;
  export let cssClass: string | null = null;
  /**
   * An optional subset of item IDs which will hide all other items not included in this set.
   * Useful for showing only search results, for example.
   */
  export let visibleItemIdSubset: Set<string> | null = null;

  // TODO: replace this with column specification array default and then allow the caller to customize the table.
  export let includeSchool: boolean = true;
  export let includeRange: boolean = true;
  export let spellComponentsBaseWidth: string = '3.75rem';
  export let targetBaseWidth: string = '7.5rem';
  export let usageBaseWidth: string = '7.5rem';

  var spellSchoolBaseWidth = '2rem';

  let controls: RenderableClassicControl[] = [];
  $: {
    controls = [
      {
        component: SpellPrepareControl,
        props: (item: Item5e, ctx: any) => ({
          spell: item,
          ctx,
        }),
        visible: (item: Item5e, _: any) => FoundryAdapter.canPrepareSpell(item),
      },
    ];

    if (allowFavorites) {
      controls.push({
        component: ItemFavoriteControl,
        props: (item: Item5e, ctx: any) => ({
          spell: item,
        }),
      });
    }

    controls.push({
      component: ItemEditControl,
      props: (item: Item5e, _: any) => ({
        item,
      }),
    });

    if ($context.unlocked) {
      controls.push({
        component: ItemDeleteControl,
        props: (item: Item5e, _: any) => ({
          item,
        }),
      });
    }

    if ($context.useActionsFeature) {
      controls.push({
        component: ActionFilterOverrideControl,
        props: (item: Item5e, _: any) => ({
          item,
        }),
      });
    }
  }

  const localize = FoundryAdapter.localize;

  $: classicControlsColumnWidth = `${controls.length * 1.25}rem`;

  declareLocation('spellbook-list-view');
</script>

<section class="spellbook-list-section {cssClass}">
  <ItemTable location={section.label}>
    <svelte:fragment slot="header">
      <ItemTableHeaderRow>
        <ItemTableColumn primary={true}>
          <span class="spell-primary-column-label">
            {section.label}
          </span>
          {#if section.usesSlots}
            <SpellSlotManagement {section} />
          {/if}
        </ItemTableColumn>
        <ItemTableColumn
          baseWidth={spellComponentsBaseWidth}
          title={localize('DND5E.SpellComponents')}
        >
          <i class="fas fa-mortar-pestle" />
        </ItemTableColumn>
        {#if includeSchool}
          <ItemTableColumn
            baseWidth={spellSchoolBaseWidth}
            title={localize('DND5E.SpellSchool')}
          >
            <i class="fas fa-hat-wizard" />
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
    </svelte:fragment>
    <svelte:fragment slot="body">
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
          let:toggleSummary
          cssClass={FoundryAdapter.getSpellRowClasses(spell)}
          hidden={visibleItemIdSubset !== null &&
            !visibleItemIdSubset.has(spell.id)}
        >
          <ItemTableCell primary={true} title={spell.name}>
            <ItemUseButton
              disabled={!$context.editable}
              item={spell}
              imgUrlOverride={spellImgUrl}
            />
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
          {#if spell.hasLimitedUses}
            <ItemTableCell baseWidth="3.125rem">
              <ItemUses item={spell} />
            </ItemTableCell>
          {/if}
          {#if allowFavorites && $settingStore.showIconsNextToTheItemName && FoundryAdapter.tryGetFlag(spell, 'favorite')}
            <InlineFavoriteIcon />
          {/if}
          <ItemTableCell baseWidth={spellComponentsBaseWidth} cssClass="no-gap">
            <SpellComponents {spell} />
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
                  --icon-fill="var(--t5e-spell-school-icon-fill)"
                  --icon-width="var(--t5e-spell-school-icon-width)"
                  --icon-height="var(--t5e-spell-school-icon-height)"
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
              <ClassicControls {controls} item={spell} {ctx} />
            </ItemTableCell>
          {/if}
        </ItemTableRow>
      {/each}
      {#if $context.unlocked}
        <ItemTableFooter
          actor={$context.actor}
          {section}
          canCreate={section.canCreate}
          isItem={true}
        />
      {/if}
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

  .spellbook-list-section {
    .spell-school-icon {
      color: var(--t5e-secondary-color);
      font-size: var(--t5e-spell-school-font-icon-size);
      margin: 0;
      padding: 0;
    }
  }
</style>
