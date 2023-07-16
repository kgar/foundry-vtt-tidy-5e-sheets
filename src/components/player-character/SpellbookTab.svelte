<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ItemTable from '../items/ItemTable.svelte';
  import ItemTableHeaderRow from '../items/ItemTableHeaderRow.svelte';
  import ItemTableColumn from '../items/ItemTableColumn.svelte';
  import ItemTableCell from '../items/ItemTableCell.svelte';
  import ItemUseButton from '../items/ItemUseButton.svelte';
  import ItemName from '../items/ItemName.svelte';
  import ItemTableRow from '../items/ItemTableRow.svelte';
  import { CONSTANTS } from 'src/constants';
  import { SettingsProvider } from 'src/settings/settings';
  import ItemEditControl from '../items/ItemEditControl.svelte';
  import ItemDuplicateControl from '../items/ItemDuplicateControl.svelte';
  import ItemDeleteControl from '../items/ItemDeleteControl.svelte';
  import ItemContext from '../items/ItemContext.svelte';
  import ListContainer from '../layout/ListContainer.svelte';
  import ItemTableFooter from '../items/ItemTableFooter.svelte';
  import ItemControls from '../items/ItemControls.svelte';
  import SpellSlotUses from '../items/SpellSlotUses.svelte';
  import ItemUses from '../items/ItemUses.svelte';
  import SpellPrepareControl from '../items/SpellPrepareControl.svelte';
  import SpellSlotMarkers from '../items/SpellSlotMarkers.svelte';
  import type { SheetFunctions } from 'src/types/types';
  import ItemFilterSearch from '../items/ItemFilterSearch.svelte';
  import ItemFilters from '../items/ItemFilters.svelte';
  import ItemFilterOption from '../items/ItemFilterOption.svelte';
  import FilteredItems from '../items/FilteredItems.svelte';
  import ItemFilterLayoutToggle from '../items/ItemFilterLayoutToggle.svelte';

  export let context: any;
  export let sheetFunctions: SheetFunctions;

  const spellAbbreviationMap = FoundryAdapter.getSpellAbbreviationMap();
  const classicControlsEnabled =
    SettingsProvider.settings.classicControlsEnabled.get();
  const allowEdit = FoundryAdapter.tryGetFlag(context.actor, 'allow-edit');
  const classicControlsBaseWidth = allowEdit ? '7.5rem' : '5.3125rem';

  const localize = FoundryAdapter.localize;

  function getSpellRowClasses(spell: any): string {
    const classes: string[] = [];
    if (spell.system.preparation.prepared) {
      classes.push('prepared');
    }
    if (spell.system.preparation.mode === 'always') {
      classes.push('always-prepared');
    }
    if (spell.system.preparation.mode === 'pact') {
      classes.push('pact');
    }
    if (spell.system.preparation.mode === 'atwill') {
      classes.push('at-will');
    }
    if (spell.system.preparation.mode === 'innate') {
      classes.push('innate');
    }
    return classes.join(' ');
  }

  const hideIconsNextToTheItemName =
    SettingsProvider.settings.hideIconsNextToTheItemName.get();
  let searchCriteria: string = '';

  const abilities = Object.entries(context.abilities).map(
    (a: [string, { label: string }]) => ({
      abbr: a[0],
      ...a[1],
    })
  );
</script>

<ItemFilters>
  <ItemFilterSearch
    bind:searchCriteria
    actor={context.actor}
    searchFlag="spell-search"
  />
  <ItemFilterOption setName="spellbook" filterName="action" {sheetFunctions}>
    {localize('DND5E.Action')}
  </ItemFilterOption>
  <ItemFilterOption setName="spellbook" filterName="bonus" {sheetFunctions}>
    {localize('DND5E.BonusAction')}
  </ItemFilterOption>
  <ItemFilterOption setName="spellbook" filterName="reaction" {sheetFunctions}>
    {localize('DND5E.Reaction')}
  </ItemFilterOption>
  <ItemFilterOption
    setName="spellbook"
    filterName="concentration"
    {sheetFunctions}
  >
    {localize('DND5E.Concentration')}
  </ItemFilterOption>
  <ItemFilterOption setName="spellbook" filterName="ritual" {sheetFunctions}>
    {localize('DND5E.Ritual')}
  </ItemFilterOption>
  <ItemFilterOption setName="spellbook" filterName="prepared" {sheetFunctions}>
    {localize('DND5E.Prepared')}
  </ItemFilterOption>
  <ItemFilterLayoutToggle />
</ItemFilters>

<ListContainer>
  <div class="spellbook-list">
    {#each context.spellbook as section}
      <FilteredItems {searchCriteria} items={section.spells} let:filteredItems>
        <ItemTable>
          <ItemTableHeaderRow>
            <ItemTableColumn primary={true}>
              <span class="spell-primary-column-label">
                {section.label}
              </span>
              {#if section.usesSlots}
                <!-- Spell slot markers here -->
                {#if !SettingsProvider.settings.hideSpellSlotMarker.get()}
                  <SpellSlotMarkers {context} {section} />
                {/if}
                <SpellSlotUses {context} {section} />
              {/if}
            </ItemTableColumn>
            <ItemTableColumn
              baseWidth="4.375rem"
              title={localize('DND5E.SpellComponents')}
            >
              <i class="fas fa-mortar-pestle" />
            </ItemTableColumn>
            <ItemTableColumn
              baseWidth="5.625rem"
              title={localize('DND5E.SpellSchool')}
            >
              <i class="fas fa-hat-wizard" />
            </ItemTableColumn>
            <ItemTableColumn
              baseWidth="7.5rem"
              title={localize('DND5E.SpellTarget')}
            >
              {localize('DND5E.Target')}
            </ItemTableColumn>
            <ItemTableColumn
              baseWidth="4.375rem"
              title={localize('DND5E.SpellRange')}
            >
              {localize('DND5E.Range')}
            </ItemTableColumn>
            <ItemTableColumn
              title={localize('DND5E.SpellUsage')}
              baseWidth="7.5rem"
            >
              {localize('DND5E.Usage')}
            </ItemTableColumn>
            <ItemTableColumn baseWidth={classicControlsBaseWidth} />
          </ItemTableHeaderRow>
          {#each filteredItems as spell}
            <ItemTableRow
              item={spell}
              on:mousedown={(event) =>
                FoundryAdapter.editOnMiddleClick(event.detail, spell)}
              contextMenu={{
                type: CONSTANTS.CONTEXT_MENU_TYPE_ITEMS,
                id: spell.id,
              }}
              let:toggleSummary
              cssClass={getSpellRowClasses(spell)}
            >
              <ItemTableCell primary={true}>
                <ItemUseButton item={spell} />
                <ItemName
                  on:click={(event) =>
                    toggleSummary(event.detail, context.actor)}
                >
                  {spell.name}
                </ItemName>
              </ItemTableCell>
              {#if spell.system.uses.per}
                <ItemTableCell baseWidth="3.125rem">
                  <ItemUses item={spell} />
                </ItemTableCell>
              {/if}
              {#if !hideIconsNextToTheItemName && FoundryAdapter.tryGetFlag(spell, 'favorite')}
                <div class="item-state-icon" title="Favorite">
                  <i class="fas fa-bookmark icon-fav" />
                </div>
              {/if}
              <ItemTableCell baseWidth="4.375rem" cssClass="components">
                {#each spell.labels.components.all as component}
                  <span
                    class="spell-component {component.tag
                      ? component.abbr
                      : ''}"
                    title={spellAbbreviationMap.get(component.abbr)}
                    >{component.abbr}</span
                  >
                {/each}
              </ItemTableCell>
              <ItemTableCell
                baseWidth="5.625rem"
                title="{localize('DND5E.SpellSchool')}: {spell.labels.school}"
              >
                <span class="truncate">{spell.labels.school}</span>
              </ItemTableCell>
              <ItemTableCell
                baseWidth="7.5rem"
                title="{localize('DND5E.Target')}: {spell.labels.target}"
              >
                {#if spell.labels.target}
                  {spell.labels.target}
                {:else}
                  {localize('DND5E.None')}
                {/if}
              </ItemTableCell>
              <ItemTableCell
                baseWidth="4.375rem"
                title="{localize('DND5E.Range')}: {spell.labels.range}"
              >
                {spell.labels.range}
              </ItemTableCell>
              <ItemTableCell
                baseWidth="7.5rem"
                title={localize('DND5E.SpellUsage')}
              >
                {spell.labels.activation}
              </ItemTableCell>
              {#if context.owner && classicControlsEnabled}
                <ItemTableCell baseWidth={classicControlsBaseWidth}>
                  <ItemContext
                    item={spell}
                    itemContext={context.itemContext}
                    let:ctx
                  >
                    <ItemControls>
                      {#if spell.system.preparation?.mode === 'always'}
                        <span />
                      {:else if section.canPrepare}
                        <SpellPrepareControl {ctx} {spell} />
                      {/if}
                      <ItemEditControl item={spell} />
                      {#if allowEdit}
                        <ItemDuplicateControl item={spell} />
                        <ItemDeleteControl item={spell} />
                      {/if}
                    </ItemControls>
                  </ItemContext>
                </ItemTableCell>
              {/if}
            </ItemTableRow>
          {/each}
          <ItemTableFooter actor={context.actor} dataset={section.dataset} />
        </ItemTable>
      </FilteredItems>
    {/each}
  </div>
</ListContainer>

<div class="spellcasting-ability">
  <h3 class="spell-dc spell-mod">
    {localize('DND5E.SpellDC')}
    {context.system.attributes.spelldc} / {localize('TIDY5E.SpellAttackMod')}:
    <span class="spell-attack-mod" />
  </h3>
  <div class="max-prepared-spells">
    <p>{localize('TIDY5E.PreparedSpells')}</p>
    <span class="spells-prepared">{context.preparedSpells ?? 0}</span>
    /
    <input
      class="max-preparation"
      type="number"
      name="flags.{CONSTANTS.MODULE_ID}.maxPreparedSpells"
      value={FoundryAdapter.tryGetFlag(context.actor, 'maxPreparedSpells')}
      data-dtype="Number"
      placeholder="0"
      data-tooltip={localize('TIDY5E.PreparedSpellsMax')}
    />
  </div>
  <div class="spellcasting-attribute">
    <p>{localize('DND5E.SpellAbility')}</p>
    <select name="system.attributes.spellcasting" data-type="String">
      <option value="" selected={!context.system.attributes.spellcasting}
        >{localize('DND5E.None')}</option
      >
      {#each abilities as ability}
        <option
          value={ability.abbr}
          selected={context.system.attributes.spellcasting === ability.abbr}
          >{ability.label}</option
        >
      {/each}
    </select>
  </div>
</div>

<style lang="scss">
  .spell-primary-column-label {
    font-size: 0.75rem;
    line-height: 0.75rem;
    flex: 0 0 3.75rem;
    white-space: nowrap;
  }

  .spellbook-list {
    :global(.prepared) {
      background-color: var(--t5e-equipped);
    }

    :global(.always-prepared) {
      background-color: var(--t5e-alwaysprepared);
    }

    :global(.pact) {
      background-color: var(--t5e-pact);
    }

    :global(.at-will) {
      background-color: var(--t5e-atwill);
    }

    :global(.innate) {
      background-color: var(--t5e-innate);
    }
  }

  .spell-component.C,
  .spell-component.R {
    color: var(--t5e-background);
    background: var(--t5e-tertiary-color);
    border-radius: 2px;
    padding: 1px 1px 0 1px;
    margin: 0px 0 0 1px;
    line-height: 12px;
  }

  .spellbook-list :global(.components) {
    gap: 0;
  }
</style>
