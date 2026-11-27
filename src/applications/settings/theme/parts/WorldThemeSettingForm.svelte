<script lang="ts">
  import { InputAttachments } from 'src/attachments/input-attachments.svelte';
  import type { TabStripInfo } from 'src/components/tabs/Tabs.svelte';
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import {
    getAppliesToSegments,
    getEffectiveTypeSelection,
  } from 'src/settings/editors/shared/theme-setting-functions';
  import type {
    WorldThemeSettingEntry,
    WorldThemesSettingsEditor,
  } from 'src/settings/editors/world-themes-settings-editor.svelte';
  import ThemeSettings from './ThemeSettings.svelte';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import { actorHeaderBackgroundSupportedActorTypes, isWorldDefaultTheme } from 'src/theme/theme';
  import WorldThemeSettingFilters from './WorldThemeSettingFilters.svelte';

  type Props = {
    app: WorldThemesSettingsEditor;
  };

  type SubTabId = 'theme' | 'filter';

  let { app }: Props = $props();

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

  const appliesTo = $derived(
    selectedTheme ? getAppliesToSegments(app.documentTypeTree, selectedTheme) : [],
  );

  function getSelectedTypes(documentName: string) {
    const node = app.documentTypeTree.find(
      (n) => n.documentName === documentName,
    );
    return node && selectedTheme
      ? getEffectiveTypeSelection(node, selectedTheme)
      : [];
  }

  const selectedActorTypes = $derived(
    getSelectedTypes(CONSTANTS.DOCUMENT_NAME_ACTOR),
  );

  const selectedItemTypes = $derived(
    getSelectedTypes(CONSTANTS.DOCUMENT_NAME_ITEM),
  );
</script>

{#if selectedTheme}
  <div class="world-theme-detail-actions">
    <button type="button" class="button" onclick={() => app.closeTheme()}>
      <i class="fa-solid fa-arrow-left"></i>
      {localize('SETUP.GoBack')}
    </button>
    <div>
      <button
        type="button"
        class="button"
        onclick={() => app.duplicate(selectedTheme)}
      >
        <i class="fa-solid fa-copy"></i>
        {localize('DND5E.ContextMenuActionDuplicate')}
      </button>
      <button
        type="button"
        class="button"
        onclick={() => app.import(selectedTheme)}
      >
        <i class="fa-solid fa-file-import"></i>
        {localize('TIDY5E.SETTINGS.Theme.Action.Import')}
      </button>
      <button
        type="button"
        class="button"
        onclick={() => app.export(selectedTheme)}
      >
        <i class="fa-solid fa-file-export"></i>
        {localize('TIDY5E.SETTINGS.Theme.Action.Export')}
      </button>
      <button
        type="button"
        class="button"
        onclick={() => {
          if (selectedTheme) {
            app.deleteTheme(selectedTheme.id);
          }
        }}
      >
        <i class="fa-solid fa-trash"></i>
        {localize('TIDY5E.COMMON.Theme.Delete')}
      </button>
    </div>
  </div>
  <div class="theme-identity-fields">
    {#if !isWorldDefaultTheme(selectedTheme)}
    <div class="form-group">
      <label for="{appId}-theme-name">
        {localize('TIDY5E.COMMON.Theme.Name')}
      </label>
      <div class="form-fields">
        <input
          id="{appId}-theme-name"
          class="document-name"
          type="text"
          bind:value={selectedTheme.name}
          {@attach InputAttachments.selectOnFocus}
        />
      </div>
    </div>
    <div class="form-group">
      <label>{localize('TIDY5E.COMMON.Theme.AppliesTo')}</label>
      <div class="form-fields">
        <span class="theme-applies-to-summary">
          {#each appliesTo as segment, i}{#if i > 0}<div class="divider-dot"></div>{/if}<span>{segment}</span>{/each}
        </span>
      </div>
    </div>

    {:else}

    <h2>{selectedTheme.name}</h2>
    {/if}
  </div>

  <!-- Don't show tabs for the default theme -->
  {#if !isWorldDefaultTheme(selectedTheme)}
    <div class="tabs-row tab-configuration-tabs">
      <Tabs bind:selectedTabId={currentSubTabId} {tabs} cssClass="item-tabs" />
      <hr class="golden-fade" />
    </div>
  {/if}

  {#if currentSubTabId === 'theme'}
    <div class="flex1">
      <ThemeSettings
        bind:settings={selectedTheme.settings}
        rarities={app.rarities}
        spellPreparationMethodColors={app.spellMethods}
        placeholders={undefined}
        showActorPortraitShape={selectedActorTypes.length > 0}
        showActorHeaderBackground={selectedActorTypes.some((type) =>
          actorHeaderBackgroundSupportedActorTypes.has(type),
        )}
        showItemSidebarBackground={selectedItemTypes.length > 0}
      />
    </div>
  {/if}

  {#if currentSubTabId === 'filter'}
    <div class="flex1 theme-filter-settings">
      <WorldThemeSettingFilters {app} {selectedTheme} />
    </div>
  {/if}
{/if}
