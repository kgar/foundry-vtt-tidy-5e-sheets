<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ActorSheetQuadroneContext } from 'src/types/types';
  import { MCDM_CLASS_BUNDLE_CONSTANTS } from './McdmClassBundleConstants';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import { getContext } from 'svelte';
  import { CONSTANTS } from 'src/constants';
  import ItemsActionBar from 'src/sheets/quadrone/shared/ItemsActionBar.svelte';
  import McdmPowersTables from './McdmPowersTables.svelte';
  import TidyTableHeaderRow from 'src/components/table-quadrone/TidyTableHeaderRow.svelte';
  import TidyTableHeaderCell from 'src/components/table-quadrone/TidyTableHeaderCell.svelte';
  import TidyTable from 'src/components/table-quadrone/TidyTable.svelte';
  import TidyTableRow from 'src/components/table-quadrone/TidyTableRow.svelte';
  import TidyTableCell from 'src/components/table-quadrone/TidyTableCell.svelte';
  import { observeResize } from 'src/features/resize-observation/attachments';
  import {
    buildMcdmPowersSections,
    buildMcdmPowersSettingsTab,
  } from './settings/McdmPowersSettingsTab';
  import { TidySheetSettingsQuadroneApplication } from 'src/applications/settings/sheet/TidySheetSettingsQuadroneApplication.svelte';

  let context = $derived(getSheetContext<ActorSheetQuadroneContext>());

  const localize = FoundryAdapter.localize;

  let dynamicColumnWidth: number = $state(0);

  function onResize(entry: ResizeObserverEntry) {
    const labelWidth =
      parseFloat(getComputedStyle(document.documentElement).fontSize) * 5;
    dynamicColumnWidth =
      (entry.borderBoxSize[0].inlineSize - labelWidth) /
      (Object.keys(strainTypes).length ?? 3);
  }

  const strainTypes = CONFIG.MCDM.strainTypes;

  let levels = Array.fromRange(9);

  let tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  let settingsTab = $derived(buildMcdmPowersSettingsTab(context, tabId));
  let tabOptionGroups = $derived(settingsTab.optionsGroups ?? []);

  let searchCriteria = $state('');

  let maxStrainFormula = $derived(
    FoundryAdapter.getProperty<string | undefined>(
      context.actor,
      MCDM_CLASS_BUNDLE_CONSTANTS.MAX_STRAIN_FLAG_PROP,
    ) || MCDM_CLASS_BUNDLE_CONSTANTS.MAX_STRAIN_DEFAULT_FORMULA,
  );

  let maxStrain = $derived.by(() => {
    try {
      return Roll.create(maxStrainFormula, context.rollData).evaluateSync()
        .total;
    } catch {
      ui.notifications.error(
        'MCDMCB.TALENT.STRAIN.WARNING.NonDeterministicStrainFormula',
        {
          format: {
            name: context.actor.name,
          },
          localize: true,
        },
      );
      return Roll.create(
        MCDM_CLASS_BUNDLE_CONSTANTS.MAX_STRAIN_DEFAULT_FORMULA,
        context.rollData,
      ).evaluateSync().total;
    }
  });

  let currentStrain = $derived(
    FoundryAdapter.getProperty<Record<string, number> | undefined>(
      context.actor,
      MCDM_CLASS_BUNDLE_CONSTANTS.CURR_STRAIN_FLAG_PROP,
    ) ?? { body: 0, mind: 0, soul: 0 },
  );

  let totalStrain = $derived(
    Object.values(currentStrain).reduce((acc, i) => acc + i, 0),
  );

  let powerSections = $derived(buildMcdmPowersSections(context, tabId));

  function onChangeStrain(strainType: string, strainLevel: number) {
    context.actor.update({
      [`${MCDM_CLASS_BUNDLE_CONSTANTS.CURR_STRAIN_FLAG_PROP}.${strainType}`]:
        strainLevel,
    });
  }

  function onAddClicked() {
    context.actor.sheet._addDocument({
      tabId,
    });
  }

  function openTabSettings() {
    context.editable &&
    context.sheet._renderChild(
      new TidySheetSettingsQuadroneApplication({
        document: context.document,
        initialTabId: tabId,
        tabSettings: { [tabId]: settingsTab },
      }),
    )
  }
</script>

<div class="tab-content">
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
    <div class="tidy-strain-container" {@attach observeResize(onResize)}>
      <TidyTable key="strain-table">
        {#snippet header(expanded)}
          <TidyTableHeaderRow class={['theme-dark']}>
            <TidyTableHeaderCell
              columnWidth="5rem"
              primary={true}
              class="header-label-cell"
              data-tidy-column-key="strain-level"
            >
              <h3>{localize('MCDMCB.TALENT.STRAIN.Label')}</h3>
            </TidyTableHeaderCell>
            {#each Object.entries(strainTypes) as [strainKey, strainType]}
              <TidyTableHeaderCell
                columnWidth="{dynamicColumnWidth}px"
                data-tidy-column-key={strainKey}
              >
                {strainType.header}
              </TidyTableHeaderCell>
            {/each}
          </TidyTableHeaderRow>
        {/snippet}

        {#snippet body()}
          {#each levels as level}
            <TidyTableRow>
              {#snippet children()}
                <TidyTableCell
                  columnWidth="5rem"
                  attributes={{ ['data-tidy-column-key']: 'strain-level' }}
                >
                  {level}
                </TidyTableCell>
                {#each Object.entries(strainTypes) as [strainKey, strainType]}
                  <TidyTableCell
                    columnWidth="{dynamicColumnWidth}px"
                    class="tidy-mcdm-strain-effects"
                    attributes={{
                      ['data-tidy-column-key']: strainKey,
                      ['data-tooltip']: strainType.effects[level].tooltip,
                    }}
                  >
                    <input
                      id="{strainKey}-{level}"
                      type="radio"
                      name={strainKey}
                      data-dtype="Number"
                      value={currentStrain[strainKey]}
                      checked={currentStrain[strainKey] === level}
                      disabled={maxStrain - totalStrain <
                        level - currentStrain[strainKey]}
                      onchange={() => {
                        onChangeStrain(strainKey, level);
                      }}
                    />
                    <label
                      class={currentStrain[strainKey] >= level
                        ? 'selected'
                        : ''}
                      for="{strainKey}-{level}"
                      >{strainType.effects[level].label}</label
                    >
                  </TidyTableCell>
                {/each}
              {/snippet}
            </TidyTableRow>
          {/each}
        {/snippet}
      </TidyTable>
    </div>
  {/if}
  <ItemsActionBar
    bind:searchCriteria
    sections={powerSections}
    {tabId}
    {tabOptionGroups}
    onConfigureClick={openTabSettings}
  />
  <McdmPowersTables
    sections={powerSections}
    {searchCriteria}
    {context}
    {tabId}
  />
  <div class={['sheet-footer flexrow']}>
    <div></div>
    {#if context.editable}
      <div class="sheet-footer-right flexshrink">
        <!-- svelte-ignore a11y_missing_attribute -->
        <a
          aria-label={localize('DND5E.ItemCreate')}
          role="button"
          tabindex="0"
          data-tooltip="DND5E.ItemCreate"
          class="button button-icon-only button-primary item-create"
          class:disabled={!context.editable}
          onclick={onAddClicked}
          onkeydown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              onAddClicked();
            }
          }}
        >
          <i class="fas fa-plus"></i>
        </a>
      </div>
    {/if}
  </div>
</div>
