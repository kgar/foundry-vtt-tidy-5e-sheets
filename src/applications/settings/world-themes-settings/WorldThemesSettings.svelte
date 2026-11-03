<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { WorldThemesSettingsEditor } from 'src/settings/editors/world-themes-settings-editor.svelte';
  import { actorHeaderBackgroundSupportedActorTypes } from 'src/theme/theme';
  import ThemeSettings3 from '../theme/ThemeSettings3.svelte';
  import { InputAttachments } from 'src/attachments/input-attachments.svelte';
  import Tabs, { type TabStripInfo } from 'src/components/tabs/Tabs.svelte';
  import WorldThemeSettingFilters from './WorldThemeSettingFilters.svelte';

  type Props = {
    app: WorldThemesSettingsEditor;
  };

  type SubTabId = 'theme' | 'filter';

  let { app }: Props = $props();

  const config = $derived(app.value);
  const selectedTheme = $derived(app.selectedTheme);
  const appId = foundry.utils.randomID();
  let currentSubTabId: SubTabId = $state('theme');

  const tabs: TabStripInfo[] = [
    {
      id: 'theme',
      title: 'TIDY5E.COMMON.Theme.Configure',
    },
    {
      id: 'filter',
      title: 'TIDY5E.COMMON.Theme.ConfigureFilters',
    },
  ];

  const localize = FoundryAdapter.localize;

  const orderedThemes = $derived(
    config.settings.toSorted((a, b) => a.sort - b.sort),
  );
</script>

<div class="tidy-sheet-settings">
  <div class="settings-nav" role="tablist" aria-orientation="vertical">
    <div class="nav-group">
      <h3 class="nav-group-header">
        {localize('TIDY5E.COMMON.Theme.LabelPl')}
      </h3>
      {#each orderedThemes as theme}
        <button
          onclick={() => app.selectTheme(theme.id)}
          class={[
            'nav-tab',
            {
              active: selectedTheme?.id === theme.id,
            },
          ]}>{theme.name}</button
        >
      {/each}
    </div>

    <button
      type="button"
      class="button button-primary"
      onclick={() => app.addTheme()}
    >
      <i class="fa-solid fa-plus"></i>
      {localize('TIDY5E.COMMON.Theme.Add')}
    </button>
  </div>
  <section class="settings-pane" role="tabpanel">
    {#key app.updateSignal}
      <div class="dialog-content-container flexcol">
        {#if selectedTheme}
          <div class="form-group stacked">
            <label for="{appId}-theme-name">
              {localize('TIDY5E.COMMON.Theme.Name')}
            </label>
            <div class="form-fields">
              <input
                id="{appId}-theme-name"
                type="text"
                bind:value={selectedTheme.name}
                {@attach InputAttachments.selectOnFocus}
              />
              <button
                type="button"
                class="button"
                data-tooltip=""
                aria-label={localize('TIDY5E.COMMON.Theme.Delete')}
                onclick={() => {
                  if (selectedTheme) {
                    app.deleteTheme(selectedTheme.id);
                  }
                }}
              >
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
          <div class="tabs-row tab-configuration-tabs">
            <Tabs
              bind:selectedTabId={currentSubTabId}
              {tabs}
              cssClass="item-tabs"
            />
            <hr class="golden-fade" />
          </div>

          {#if currentSubTabId === 'theme'}
            <div class="flex1">
              <ThemeSettings3
                bind:settings={selectedTheme.settings}
                rarities={app.rarities}
                spellPreparationMethodColors={app.spellMethods}
                placeholders={undefined}
                showActorPortraitShape={!!selectedTheme.documentNames?.includes(
                  CONSTANTS.DOCUMENT_NAME_ACTOR,
                ) || !selectedTheme.documentNames?.length}
                showActorHeaderBackground={!selectedTheme.documentNames
                  ?.length ||
                  (!!selectedTheme.types?.length &&
                    selectedTheme.types.some(
                      actorHeaderBackgroundSupportedActorTypes.has,
                    ))}
                showItemSidebarBackground={!selectedTheme.documentNames
                  ?.length ||
                  selectedTheme.documentNames.includes(
                    CONSTANTS.DOCUMENT_NAME_ITEM,
                  )}
              />
            </div>
          {/if}

          {#if currentSubTabId === 'filter'}
            <div class="flex1">
              <WorldThemeSettingFilters {app} {selectedTheme} />
            </div>
          {/if}
        {/if}
      </div>
    {/key}
  </section>
</div>
