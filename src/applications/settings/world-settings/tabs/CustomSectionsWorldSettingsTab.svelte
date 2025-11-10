<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getContext } from 'svelte';
  import { SettingsProvider } from 'src/settings/settings.svelte';
  import type { WorldSettingsContext } from '../WorldSettings.types';
  import { CONSTANTS } from 'src/constants';
  import type { GlobalCustomSectionsetting as GlobalCustomSectionSetting } from 'src/settings/settings.types';
  import CharacterSheetClassicRuntime from 'src/runtime/actor/CharacterSheetClassicRuntime.svelte';
  import { error } from 'src/utils/logging';
  import type { RegisteredTab } from 'src/runtime/types';
  import HorizontalLineSeparator from 'src/components/layout/HorizontalLineSeparator.svelte';
  import NpcSheetClassicRuntime from 'src/runtime/actor/NpcSheetClassicRuntime.svelte';
  import GroupSheetClassicRuntime from 'src/runtime/actor/GroupSheetClassicRuntime.svelte';

  const context = getContext<WorldSettingsContext>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  const appId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.APP_ID);

  function createNewSection(): GlobalCustomSectionSetting {
    return {
      section: '',
      showWhenEmpty: false,
      showWhenEmptyFilters: {},
    };
  }

  function removeSection(section: GlobalCustomSectionSetting) {
    context.settings.globalCustomSections =
      context.settings.globalCustomSections.filter((x) => x !== section);
  }

  const localize = FoundryAdapter.localize;

  type TabFilterOption = { id: string; title: string };

  type SheetFilterOption = {
    type: string;
    label: string;
    tabs: TabFilterOption[];
  };

  let classicCharacterTabs =
    CharacterSheetClassicRuntime.getAllRegisteredTabs();

  let classicNpcTabs = NpcSheetClassicRuntime.getAllRegisteredTabs();

  let classicGroupTabs = GroupSheetClassicRuntime.getAllRegisteredTabs();

  let sheetTypes: SheetFilterOption[] = [
    {
      type: CONSTANTS.SHEET_TYPE_CHARACTER,
      label: localize('TYPES.Actor.character'),
      tabs: mapTabs(classicCharacterTabs, [
        CONSTANTS.TAB_ACTOR_INVENTORY,
        CONSTANTS.TAB_ACTOR_SPELLBOOK,
        CONSTANTS.TAB_CHARACTER_FEATURES,
      ]),
    },
    {
      type: CONSTANTS.SHEET_TYPE_NPC,
      label: localize('DND5E.NPC.Label'),
      tabs: mapTabs(classicNpcTabs, [
        CONSTANTS.TAB_NPC_ABILITIES,
        CONSTANTS.TAB_ACTOR_INVENTORY,
        CONSTANTS.TAB_ACTOR_SPELLBOOK,
      ]),
    },
    {
      type: CONSTANTS.SHEET_TYPE_GROUP,
      label: localize('TYPES.Actor.group'),
      tabs: mapTabs(classicGroupTabs, [CONSTANTS.TAB_ACTOR_INVENTORY]),
    },
  ];

  function mapTabs(tabs: RegisteredTab<any>[], subset: string[] = []) {
    let mappedTabs: TabFilterOption[] = [];
    try {
      for (let tab of tabs) {
        if (subset.length && !subset.includes(tab.id)) {
          continue;
        }
        let title = localize(
          typeof tab.title === 'function' ? tab.title() : tab.title,
        );
        mappedTabs.push({
          id: tab.id,
          title,
        });
      }
    } catch (e) {
      error('An error occurred while preparing a tab ');
    }

    return mappedTabs.sort((left, right) =>
      left.title.localeCompare(right.title, game.i18n.lang),
    );
  }

  function toggleSheetFilter(
    sectionConfig: GlobalCustomSectionSetting,
    sheetType: string,
    checked: boolean,
  ) {
    if (!checked) {
      delete sectionConfig.showWhenEmptyFilters[sheetType];
    } else {
      sectionConfig.showWhenEmptyFilters[sheetType] ??= [];
    }
  }

  function toggleTab(
    sectionConfig: GlobalCustomSectionSetting,
    sheetType: string,
    tabId: string,
    checked: boolean,
  ) {
    if (!checked) {
      sectionConfig.showWhenEmptyFilters[sheetType] =
        sectionConfig.showWhenEmptyFilters[sheetType].filter(
          (x) => x !== tabId,
        );
    } else {
      sectionConfig.showWhenEmptyFilters[sheetType].push(tabId);
    }
  }
</script>

<div class="settings-form">
  <article class="setting group">
    <section class="flex-column small-gap">
      <div class="description">
        <label for="globalCustomSections-{appId}"
          >{localize(
            SettingsProvider.settings.globalCustomSections.options.name,
          )}</label
        >
        <p class="tidy5e-notes">
          {localize(
            SettingsProvider.settings.globalCustomSections.options.hint,
          )}
        </p>
      </div>
      {#each context.settings.globalCustomSections as sectionConfig}
        {@const hasAdvancedSettings = sectionConfig.showWhenEmpty}
        <details>
          <summary
            class:has-advanced-settings={hasAdvancedSettings}
            onkeyup={(ev) =>
              ev.target === ev.currentTarget || ev.preventDefault()}
          >
            <span class="section-summary">
              <span class="input-group">
                <input
                  type="text"
                  class="custom-section-name"
                  bind:value={sectionConfig.section}
                  placeholder={localize('TIDY5E.Section.Label')}
                />
                {#if hasAdvancedSettings}
                  <span class="customize-indicator">
                    {localize(
                      'TIDY5E.WorldSettings.TabCustomSections.CustomizedIndicatorLabel',
                    )}
                  </span>
                {/if}
              </span>
              <button
                type="button"
                title={localize('TIDY5E.ContextMenuActionDelete')}
                onclick={() => removeSection(sectionConfig)}
                class="inline-icon-button"
              >
                <i class="fa-solid fa-trash"></i>
              </button>
            </span>
          </summary>
          <div
            class="settings-group custom-section-settings flex-column small-gap"
          >
            <div>
              <label
                title={localize(
                  'TIDY5E.WorldSettings.TabCustomSections.ShowWhenEmptyTooltip',
                )}
                class="flex-row align-items-center extra-small-gap"
              >
                <input
                  type="checkbox"
                  bind:checked={sectionConfig.showWhenEmpty}
                />
                <span
                  >{localize(
                    'TIDY5E.WorldSettings.TabCustomSections.ShowWhenEmptyLabel',
                  )}</span
                >
                <i class="fa-solid fa-info-circle"></i>
              </label>
            </div>

            {#if sectionConfig.showWhenEmpty}
              <div class="custom-section-sheets">
                <div class="custom-section-setting-header">
                  {localize(
                    'TIDY5E.WorldSettings.TabCustomSections.LimitToSpecificSheetsLabel',
                  )}
                </div>
                {#each sheetTypes as sheetType}
                  {@const sheetSelected =
                    sheetType.type in sectionConfig.showWhenEmptyFilters}
                  <div class="custom-section-sheet">
                    <label class="flex-row align-items-center extra-small-gap">
                      <input
                        type="checkbox"
                        checked={sheetSelected}
                        onchange={(ev) =>
                          toggleSheetFilter(
                            sectionConfig,
                            sheetType.type,
                            ev.currentTarget.checked,
                          )}
                      />
                      {sheetType.label}
                    </label>
                    {#if sheetSelected && sheetType.tabs.length > 0}
                      <div class="custom-section-sheet-tabs">
                        <div class="custom-section-setting-header">
                          {localize(
                            'TIDY5E.WorldSettings.TabCustomSections.LimitToSpecificTabsLabel',
                          )}
                        </div>
                        <div class="custom-section-sheet-tab-options">
                          {#each sheetType.tabs as tab (tab.id)}
                            <label
                              class="flex-row align-items-center extra-small-gap"
                            >
                              <input
                                type="checkbox"
                                checked={!!sectionConfig.showWhenEmptyFilters[
                                  sheetType.type
                                ]?.includes(tab.id)}
                                onchange={(ev) =>
                                  toggleTab(
                                    sectionConfig,
                                    sheetType.type,
                                    tab.id,
                                    ev.currentTarget.checked,
                                  )}
                              />
                              {tab.title}
                            </label>
                          {/each}
                        </div>
                      </div>
                    {/if}
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        </details>

        <HorizontalLineSeparator />
      {/each}
      <button
        type="button"
        onclick={() =>
          context.settings.globalCustomSections.push(createNewSection())}
      >
        <i class="fa-solid fa-plus"></i>
        {localize('TIDY5E.Section.SectionSelectorCreateNewSection')}
      </button>
    </section>
  </article>
</div>

<style lang="less">
  .section-summary {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    width: calc(100% - 1.37em);
  }

  .custom-section-settings {
    padding: 0.5rem;
  }

  .custom-section-setting-header {
    font-weight: 500;
  }

  .custom-section-sheets {
    display: flex;
    flex-direction: column;
    gap: 0.325rem;
    margin-inline-start: 0.5rem;
    padding-inline-start: 0.5rem;
    border-left: 0.125rem solid var(--t5e-separator-color);
  }

  .custom-section-setting-header {
    border-bottom: 1.5px solid var(--t5e-light-color);
    margin-block-start: 0.25rem;
    margin-block-end: 0.125rem;
  }

  .custom-section-sheet-tabs {
    padding: 0.25rem 0.5rem 0.5rem 0.5rem;
    margin-block: 0.5rem;
    margin-inline-start: 0.5rem;
    padding-inline-start: 0.5rem;
    background-color: var(--t5e-faintest-color);
    border-radius: 0.25rem;

    .custom-section-setting-header {
      margin-block-start: 0;
      margin-block-end: 0.5rem;
    }
  }

  .custom-section-sheet-tab-options {
    display: flex;
    column-gap: 0.75rem;
    row-gap: 0.5rem;
    flex-wrap: wrap;
  }

  .custom-section-name {
    flex: 1;
  }

  .customize-indicator {
    font-size: var(--font-size-12);
    color: var(--t5e-tertiary-color);
    align-self: center;
  }

  .input-group {
    flex: 1;
  }
</style>
