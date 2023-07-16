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

  export let context: any;

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

  function onSpellMarkerClick(section: any, markerIndex: number) {
    let isEmpty = markerIndex >= section.uses;

    let value = isEmpty ? markerIndex + 1 : markerIndex;

    context.actor.update({
      [`data.spells.${section.prop}.value`]: value,
    });
  }
</script>

<!-- Break some of this out into components -->
<!-- <div class="inventory-filters">
  <ul class="filter-list" data-filter="features">
    <li class="filter-title" title={localize('DND5E.Filter')}>
      <i class="fas fa-filter" />
    </li>
    <li class="filter-search" title={localize('TIDY5E.SearchHint')}>
      <input
        type="text"
        id="feat-search"
        placeholder={localize('TIDY5E.SearchFeat')}
        bind:value={searchCriteria}
        on:blur|preventDefault|stopPropagation={() => rememberSearch()}
      />
      <span
        class="clear-search"
        title={localize('TIDY5E.SearchClear')}
        style:display={searchCriteria === '' ? 'none' : undefined}
        on:click|preventDefault|stopPropagation={() => clearSearch()}
        ><i class="fas fa-times-circle" /></span
      >
    </li>
    <li class="filter-item" data-filter="action">{localize('DND5E.Action')}</li>
    <li class="filter-item" data-filter="bonus">
      {localize('DND5E.BonusAction')}
    </li>
    <li class="filter-item" data-filter="reaction">
      {localize('DND5E.Reaction')}
    </li>
  </ul>
</div> -->

<ListContainer>
  <div class="spellbook-list">
    {#each context.spellbook as section}
      <ItemTable>
        <ItemTableHeaderRow>
          <ItemTableColumn primary={true}>
            <span class="spell-primary-column-label">
              {section.label}
            </span>
            {#if section.usesSlots}
              <!-- Spell slot markers here -->
              {#if !SettingsProvider.settings.hideSpellSlotMarker.get()}
                <div class="spell-slot-markers">
                  {#each new Array(section.slots) as _, i}
                    <span
                      class="dot"
                      class:empty={i >= section.uses}
                      on:click={() => onSpellMarkerClick(section, i)}
                    />
                  {/each}
                </div>
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
        {#each section.spells as spell}
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
                on:click={(event) => toggleSummary(event.detail, context.actor)}
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
                  class="spell-component {component.tag ? component.abbr : ''}"
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
    {/each}
  </div>
</ListContainer>

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

  .spell-slot-markers {
    display: flex;
    gap: 0.125rem;
    margin-top: -0.125rem;
    align-items: center;

    .dot {
      width: 0.75rem;
      height: 0.75rem;
      border-radius: 50%;
      background-color: var(--t5e-primary-accent);
      border: 1px solid var(--t5e-primary-font);
      &:hover,
      &.change {
        background-color: var(--t5e-warning-accent);
      }

      &.empty {
        background-color: transparent;

        &:hover,
        &.change {
          background-color: var(--t5e-prepared);
        }
      }
    }
  }
</style>
