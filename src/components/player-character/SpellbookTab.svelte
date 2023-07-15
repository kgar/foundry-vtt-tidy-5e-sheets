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

  export let context: any;

  const spellAbbreviationMap = FoundryAdapter.getSpellAbbreviationMap();
  const classicControlsEnabled =
    SettingsProvider.settings.classicControlsEnabled.get();
  const allowEdit = FoundryAdapter.tryGetFlag(context.actor, 'allow-edit');
  const classicControlsBaseWidth = allowEdit ? '7.5rem' : '5.3125rem';

  let searchCriteria: string =
    FoundryAdapter.tryGetFlag<string>(context.actor, 'spell-search') ?? '';

  function rememberSearch() {}

  function clearSearch() {}

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
</script>

<div class="inventory-filters">
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
</div>

<ListContainer>
  <div class="spellbook-list">
    {#each context.spellbook as section}
      <ItemTable>
        <ItemTableHeaderRow>
          <ItemTableColumn primary={true}>
            {section.label}
            {#if section.usesSlots}
              <input
                type="text"
                name="system.spells.{section.prop}.value"
                value={section.uses}
                placeholder="0"
                data-dtype="Number"
              />
              <span class="sep"> / </span>
              <span
                class="spell-max"
                data-level={section.prop}
                data-slots={section.slots}
              >
                {section.slots}
              </span>
              {#if context.editable}
                <a
                  class="slot-max-override"
                  title={localize('DND5E.SpellProgOverride')}
                >
                  <i class="fas fa-pencil-alt" />
                </a>
              {/if}
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
          <ItemTableColumn baseWidth="7.5rem" />
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
                <input
                  class="uses-value"
                  name="system.uses.value"
                  type="text"
                  value={spell.system.uses.value}
                />
                /
                <input
                  class="uses-max"
                  name="system.uses.max"
                  type="text"
                  value={spell.system.uses.max}
                />
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
                  <div class="spell-controls flexrow">
                    {#if section.canPrepare}
                      <a
                        class="item-control item-toggle"
                        class:hidden={spell.system.preparation.mode ===
                          'always'}
                        title={ctx.toggleTitle}
                      >
                        {#if spell.system.preparation.prepared}
                          <i class="fas fa-book" />
                        {:else}
                          <i class="fas fa-book inactive" />
                        {/if}
                      </a>
                    {/if}
                    <ItemEditControl item={spell} />
                    {#if allowEdit}
                      <ItemDuplicateControl item={spell} />
                      <ItemDeleteControl item={spell} />
                    {/if}
                  </div>
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
