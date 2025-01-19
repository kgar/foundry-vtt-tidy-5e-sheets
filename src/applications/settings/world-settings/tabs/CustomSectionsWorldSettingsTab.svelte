<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getContext } from 'svelte';
  import { SettingsProvider } from 'src/settings/settings.svelte';
  import type { WorldSettingsContext } from '../WorldSettings.types';
  import { CONSTANTS } from 'src/constants';
  import type { GlobalCustomSectionsetting as GlobalCustomSectionSetting } from 'src/settings/settings.types';
  import { CharacterSheetRuntime } from 'src/runtime/CharacterSheetRuntime';
  import { error } from 'src/utils/logging';
  import type { RegisteredTab } from 'src/runtime/types';
  import { NpcSheetRuntime } from 'src/runtime/NpcSheetRuntime';
  import { VehicleSheetRuntime } from 'src/runtime/VehicleSheetRuntime';
  import { GroupSheetRuntime } from 'src/runtime/GroupSheetRuntime';
  import { ItemSheetRuntime } from 'src/runtime/item/ItemSheetRuntime';
  import HorizontalLineSeparator from 'src/components/layout/HorizontalLineSeparator.svelte';

  const context = getContext<WorldSettingsContext>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  const appId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.APP_ID);

  function createNewSection(): GlobalCustomSectionSetting {
    return {
      section: '',
      alwaysShow: false,
      filters: {},
    };
  }

  function removeSection(section: GlobalCustomSectionSetting) {
    context.settings.globalCustomSections =
      context.settings.globalCustomSections.filter((x) => x !== section);
  }

  const localize = FoundryAdapter.localize;

  type barney = { id: string; title: string };
  type fred = { type: string; label: string; tabs: barney[] };
  let sheetTypes: fred[] = [
    {
      type: CONSTANTS.SHEET_TYPE_CHARACTER,
      label: localize('TYPES.Actor.character'),
      tabs: mapTabs(CharacterSheetRuntime.getAllRegisteredTabs()),
    },
    {
      type: CONSTANTS.SHEET_TYPE_NPC,
      label: localize('DND5E.NPC'),
      tabs: mapTabs(NpcSheetRuntime.getAllRegisteredTabs()),
    },
    {
      type: CONSTANTS.SHEET_TYPE_VEHICLE,
      label: localize('TYPES.Actor.vehicle'),
      tabs: mapTabs(VehicleSheetRuntime.getAllRegisteredTabs()),
    },
    {
      type: CONSTANTS.SHEET_TYPE_GROUP,
      label: localize('TYPES.Actor.group'),
      tabs: mapTabs(GroupSheetRuntime.getAllRegisteredTabs()),
    },
    {
      type: CONSTANTS.SHEET_TYPE_CONTAINER,
      label: localize('TYPES.Item.container'),
      tabs: [
        {
          id: CONSTANTS.TAB_CONTAINER_CONTENTS,
          title: ItemSheetRuntime.getTabTitle(CONSTANTS.TAB_CONTAINER_CONTENTS),
        },
      ],
    },
  ];

  function mapTabs(tabs: RegisteredTab<any>[]) {
    let mappedTabs: barney[] = [];
    try {
      for (let tab of tabs) {
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
      left.title.localeCompare(right.title),
    );
  }

  function toggleSheetFilter(
    sectionConfig: GlobalCustomSectionSetting,
    sheetType: string,
    checked: boolean,
  ) {
    if (!checked) {
      delete sectionConfig.filters[sheetType];
    } else {
      sectionConfig.filters[sheetType] ??= [];
    }
  }

  function toggleTab(
    sectionConfig: GlobalCustomSectionSetting,
    sheetType: string,
    tabId: string,
    checked: boolean,
  ) {
    if (!checked) {
      sectionConfig.filters[sheetType] = sectionConfig.filters[
        sheetType
      ].filter((x) => x !== tabId);
    } else {
      sectionConfig.filters[sheetType].push(tabId);
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
        <details>
          <summary
            onkeyup={(ev) =>
              ev.target === ev.currentTarget || ev.preventDefault()}
          >
            <span class="section-summary">
              <input
                type="text"
                bind:value={sectionConfig.section}
                placeholder={localize('TIDY5E.Section.Label')}
              />
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
                  'TIDY5E.WorldSettings.TabCustomSections.AlwaysShowTooltip',
                )}
                class="flex-row align-items-center extra-small-gap"
              >
                <input
                  type="checkbox"
                  bind:checked={sectionConfig.alwaysShow}
                />
                <span
                  >{localize(
                    'TIDY5E.WorldSettings.TabCustomSections.AlwaysShowLabel',
                  )}</span
                >
              </label>
            </div>

            <div class="custom-section-sheets">
              <div class="custom-section-setting-header">
                {localize(
                  'TIDY5E.WorldSettings.TabCustomSections.LimitToSpecificSheetsLabel',
                )}
              </div>
              {#each sheetTypes as sheetType}
                {@const sheetSelected = sheetType.type in sectionConfig.filters}
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
                  {#if sheetSelected}
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
                              checked={!!sectionConfig.filters[
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
          </div>
        </details>

        <HorizontalLineSeparator />
      {/each}
      <button
        onclick={() =>
          context.settings.globalCustomSections.push(createNewSection())}
      >
        <i class="fa-solid fa-plus"></i>
        {localize('TIDY5E.Section.SectionSelectorCreateNewSection')}
      </button>
    </section>
  </article>
</div>

<style lang="scss">
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
  }

  .custom-section-setting-header {
    border-bottom: 1.5px solid var(--t5e-light-color);
    margin-block-start: 0.25rem;
    margin-block-end: 0.125rem;
  }

  .custom-section-sheet-tabs {
    padding: 0.25rem 0.5rem 0.5rem 0.5rem;
    margin-block: 0.5rem;
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
</style>
