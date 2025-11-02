<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type {
    ActorSheetQuadroneContext,
  } from 'src/types/types';
  import { MCDM_CLASS_BUNDLE_CONSTANTS } from './McdmClassBundleConstants';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import { getContext } from 'svelte';
  import { CONSTANTS } from 'src/constants';
  import ItemsActionBar from 'src/sheets/quadrone/shared/ItemsActionBar.svelte';
  import TableRowActionsRuntime from 'src/runtime/tables/TableRowActionsRuntime.svelte';
  import McdmPowersTables from './McdmPowersTables.svelte';
  import TidyTableHeaderRow from 'src/components/table-quadrone/TidyTableHeaderRow.svelte';
  import TidyTableHeaderCell from 'src/components/table-quadrone/TidyTableHeaderCell.svelte';
  import TidyTable from 'src/components/table-quadrone/TidyTable.svelte';
  import TidyTableRow from 'src/components/table-quadrone/TidyTableRow.svelte';
  import TidyTableCell from 'src/components/table-quadrone/TidyTableCell.svelte';
  import { ItemUtils } from 'src/utils/ItemUtils';
  import { UserSheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
  import { TidyFlags } from 'src/api';
  import { SheetSections } from 'src/features/sections/SheetSections';
  import type { Item5e } from 'src/types/item.types';
  import type { PowersSection } from './McdmClassBundle';

  let context = 
    $derived(
      getSheetContext<ActorSheetQuadroneContext>(),
    );

  const localize = FoundryAdapter.localize;

  let sectionsContainer: HTMLElement;
  let dynamicColumnWidth: number = $state(0);

  function onResize(entry: ResizeObserverEntry) {
    const labelWidth = parseFloat(getComputedStyle(document.documentElement).fontSize) * 5;
    dynamicColumnWidth = (entry.borderBoxSize[0].inlineSize - labelWidth) / (Object.keys(strainTypes).length ?? 3);
  }

  $effect(() => {
    const observer = new ResizeObserver(([entry]) => onResize(entry));
    observer.observe(sectionsContainer);

    return () => {
      observer.disconnect();
    };
  });

  const strainTypes = CONFIG.MCDM.strainTypes;

  let levels = Array.fromRange(9);

  let tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  let searchCriteria = $state('');

  let maxStrainFormula = $derived(
    FoundryAdapter.getProperty<string | undefined>(
      context.actor,
      MCDM_CLASS_BUNDLE_CONSTANTS.MAX_STRAIN_FLAG_PROP
    ) || MCDM_CLASS_BUNDLE_CONSTANTS.MAX_STRAIN_DEFAULT_FORMULA
  );

  let maxStrain = $derived.by(() => {
    try {
      return Roll.create(maxStrainFormula, context.rollData).evaluateSync().total;
    } catch {
      ui.notifications.error('MCDMCB.TALENT.STRAIN.WARNING.NonDeterministicStrainFormula', {
        format: {
          name: context.actor.name
        },
        localize: true
      });
      return Roll.create(MCDM_CLASS_BUNDLE_CONSTANTS.MAX_STRAIN_DEFAULT_FORMULA, context.rollData).evaluateSync().total;
    }
  });

  let currentStrain = $derived(
    FoundryAdapter.getProperty<Record<string, number> | undefined>(
      context.actor,
      MCDM_CLASS_BUNDLE_CONSTANTS.CURR_STRAIN_FLAG_PROP
    ) ?? { body: 0, mind: 0, soul: 0 }
  );

  let totalStrain = $derived(
    Object.values(currentStrain).reduce((acc, i) => acc + i, 0)
  );

  let powerSections: PowersSection[] = $derived.by(() => {
    const allPowers: Item5e[] = context.actor.itemTypes[MCDM_CLASS_BUNDLE_CONSTANTS.POWER_ITEM_TYPE];
    const customSectionPowers = allPowers.filter((p) => TidyFlags.section.get(p));
    const normalPowers = allPowers.filter((p) => !customSectionPowers.includes(p));
    
    const orderToPowersMap = Object.groupBy<any, any>(normalPowers, p => p.system.order);
    const customSectionToPowersMap = Object.groupBy<any, any>(customSectionPowers, p => TidyFlags.section.get(p));
    
    const sheetPreferences = UserSheetPreferencesService.getByType(context.actor.type);
    const sortMode = sheetPreferences.tabs?.[tabId]?.sort ?? 'm';
    const sectionConfig = TidyFlags.sectionConfig.get(context.actor)?.[tabId];
    const allSections = Object.entries(orderToPowersMap).map<PowersSection>(([order, powers]) => ({
      key: `order${order}`,
      type: 'powers' as 'powers',
      order: sectionConfig?.[`order${order}`]?.order ?? order,
      dataset: {
        ['system.order']: order
      },
      items: ItemUtils.getSortedItems(powers ?? [], sortMode),
      label: `MCDMCB.TALENT.POWERS.ORDERS.${order}`,
      canCreate: true,
      rowActions: TableRowActionsRuntime.getInventoryRowActions(context),
      headerActions: [],
      show: sectionConfig?.[`order${order}`]?.show !== false
    })).concat(Object.entries(customSectionToPowersMap).map(([sectionKey, powers]) => ({
      key: sectionKey,
      type: 'powers' as 'powers',
      order: sectionConfig?.[sectionKey]?.order ?? 1000,
      dataset: {
        [TidyFlags.section.prop]: sectionKey
      },
      items: ItemUtils.getSortedItems(powers ?? [], sortMode),
      label: sectionKey,
      canCreate: true,
      rowActions: TableRowActionsRuntime.getInventoryRowActions(context),
      headerActions: [],
      show: sectionConfig?.[sectionKey]?.show !== false
    })))
    return SheetSections.sortKeyedSections(allSections, sectionConfig)
  });

  function onChangeStrain(strainType: string, strainLevel: number) {
    context.actor.update({
      [`${MCDM_CLASS_BUNDLE_CONSTANTS.CURR_STRAIN_FLAG_PROP}.${strainType}`]: strainLevel
    });
  }

  function onAddClicked() {
    context.actor.sheet._addDocument({
      tabId
    });
  }
</script>

{#if context.actor.type === 'character'}
  <div class="strain-values flexrow">
    <div class="strain-value">
      <span class="value">{totalStrain}</span>
      {localize('MCDMCB.TALENT.STRAIN.Total')}
    </div>
    <div class="strain-value">
      <span class="value">{maxStrain}</span>
      {localize('MCDMCB.TALENT.STRAIN.Max')}
    </div>
  </div>
  <div class="tidy-strain-container" bind:this={sectionsContainer}>
    <TidyTable key="strain-table">
      {#snippet header(expanded)}
        <TidyTableHeaderRow
          class={[
            'theme-dark'
          ]}
        >
          <TidyTableHeaderCell columnWidth="5rem" primary={true} class="header-label-cell" data-tidy-column-key="strain-level">
            <h3>{localize('MCDMCB.TALENT.STRAIN.Label')}</h3>
          </TidyTableHeaderCell>
          {#each Object.entries(strainTypes) as [strainKey, strainType]}
            <TidyTableHeaderCell columnWidth="{dynamicColumnWidth}px" data-tidy-column-key={strainKey}>
              {strainType.header}
            </TidyTableHeaderCell>
          {/each}
        </TidyTableHeaderRow>
      {/snippet}

      {#snippet body()}
        {#each levels as level}
          <TidyTableRow>
            {#snippet children()}
              <TidyTableCell columnWidth="5rem" attributes={{ ['data-tidy-column-key']: 'strain-level' }}>
                {level}
              </TidyTableCell>
              {#each Object.entries(strainTypes) as [strainKey, strainType]}
                <TidyTableCell
                  columnWidth="{dynamicColumnWidth}px"
                  class='tidy-mcdm-strain-effects'
                  attributes={{
                    ['data-tidy-column-key']: strainKey,
                    ['data-tooltip']: strainType.effects[level].tooltip
                  }}
                >
                  <input
                    id="{strainKey}-{level}"
                    type="radio"
                    name="{strainKey}"
                    data-dtype="Number"
                    value={currentStrain[strainKey]}
                    checked={currentStrain[strainKey] === level}
                    disabled={maxStrain - totalStrain < level - currentStrain[strainKey]}
                    onchange={() => {
                      onChangeStrain(strainKey, level);
                    }}
                  >
                  <label class={currentStrain[strainKey] >= level ? 'selected' : ''} for="{strainKey}-{level}">{strainType.effects[level].label}</label>
                </TidyTableCell>
              {/each}
            {/snippet}
          </TidyTableRow>
        {/each}
      {/snippet}
    </TidyTable>
  </div>
{/if}
<ItemsActionBar bind:searchCriteria sections={powerSections} {tabId} />
<McdmPowersTables sections={powerSections} {searchCriteria} {context} {tabId}/>
<div class={['sheet-footer flexrow']}>
  <div></div>
  {#if context.editable}
    <div class="sheet-footer-right flexshrink">
      <a
        data-tooltip="DND5E.ItemCreate"
        class="button button-icon-only button-primary item-create"
        class:disabled={!context.editable}
        onclick={onAddClicked}
      >
        <i class="fas fa-plus"></i>
      </a>
    </div>
  {/if}
</div>
