<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import {
    TidySheetSettingsDialogIds,
    type TidySheetSettingsContext,
    type TidySheetSettingsQuadroneApplication,
    type TidySheetSettingsTabInfo,
  } from './TidySheetSettingsQuadroneApplication.svelte';
  import PlaceholderSettingsPane from './tabs/PlaceholderSettingsPane.svelte';
  import SpecialTraitsPane from './tabs/SpecialTraitsPane.svelte';
  import ThemeSettingsQuadrone from 'src/applications/theme/ThemeSettingsQuadrone.svelte';
  import SheetTabConfigurationQuadrone from 'src/applications/tab-configuration/SheetTabConfigurationQuadrone.svelte';
  import ConfigureSections from 'src/applications-quadrone/configure-sections/ConfigureSections.svelte';
  import { CONSTANTS } from 'src/constants';
  import { untrack } from 'svelte';

  interface Props {
    app: TidySheetSettingsQuadroneApplication;
    config: TidySheetSettingsContext;
  }

  let { app, config }: Props = $props();

  const localize = FoundryAdapter.localize;

  const DIALOG_TAB_THEME = TidySheetSettingsDialogIds.theme;
  const DIALOG_TAB_TAB_CONFIG = TidySheetSettingsDialogIds.tabConfig;
  const DIALOG_TAB_SIDEBAR_TAB_CONFIG = TidySheetSettingsDialogIds.sidebarTabConfig;

  type SidebarEntry = {
    id: string;
    title: string;
    iconClass?: string;
    hasChanges?: boolean;
  };

  let dialogEntries: SidebarEntry[] = $derived(
    [
      {
        id: DIALOG_TAB_THEME,
        title: localize('TIDY5E.ThemeSettings.SheetMenu.name'),
        iconClass: 'fa-solid fa-swatchbook',
        hasChanges: app.themeChildApp.hasChanges,
      },
      {
        id: DIALOG_TAB_TAB_CONFIG,
        title: localize('TIDY5E.TabConfiguration.MenuOptionText'),
        iconClass: 'fas fa-file-invoice',
        hasChanges: app.tabConfigChildApp.hasChanges,
      },
      ...(app.sidebarTabConfigChildApp
        ? [
            {
              id: DIALOG_TAB_SIDEBAR_TAB_CONFIG,
              title: localize('TIDY5E.Character.Sidebar.Title'),
              iconClass: 'fas fa-sidebar',
              hasChanges: app.sidebarTabConfigChildApp.hasChanges,
            },
          ]
        : []),
    ],
  );

  let sheetEntries: SidebarEntry[] = $derived(
    config.sheetTabs.map((t: TidySheetSettingsTabInfo) => ({
      id: `sheet:${t.id}`,
      title: t.title,
      iconClass: t.iconClass,
    })),
  );

  let allEntries: SidebarEntry[] = $derived([
    ...dialogEntries,
    ...sheetEntries,
  ]);

  let selectedId: string = $state(
    untrack(() => app.initialTabId ?? DIALOG_TAB_THEME),
  );

  $effect(() => {
    if (!allEntries.some((e) => e.id === selectedId)) {
      selectedId = allEntries[0]?.id ?? DIALOG_TAB_THEME;
    }
  });

  let selectedEntry: SidebarEntry | undefined = $derived(
    allEntries.find((e) => e.id === selectedId),
  );

  let selectedSheetTabId: string | undefined = $derived(
    selectedId.startsWith('sheet:')
      ? selectedId.slice('sheet:'.length)
      : undefined,
  );

  let configureSectionsApp = $derived(
    selectedSheetTabId
      ? app.getOrCreateConfigureSectionsChildApp(selectedSheetTabId)
      : undefined,
  );

  function selectTab(id: string) {
    selectedId = id;
  }
</script>

<div class="tidy-sheet-settings">
  <div class="settings-nav" role="tablist" aria-orientation="vertical">
    <div class="nav-group">
      <h3 class="nav-group-header">
        {localize('TIDY5E.SheetSettings.Group.SheetSettings')}
      </h3>
      {#each dialogEntries as entry (entry.id)}
        <button
          type="button"
          class={[
            'nav-tab',
            { active: entry.id === selectedId, 'has-changes': entry.hasChanges },
          ]}
          role="tab"
          aria-selected={entry.id === selectedId}
          onclick={() => selectTab(entry.id)}
        >
          {#if entry.iconClass}
            <i class={['nav-tab-icon', entry.iconClass]}></i>
          {/if}
          <span class="nav-tab-title">{entry.title}</span>
        </button>
      {/each}
    </div>

    <div class="nav-group">
      <h3 class="nav-group-header">
        {localize('TIDY5E.SheetSettings.Group.Tabs')}
      </h3>
      {#if sheetEntries.length === 0}
        <div class="nav-empty hint">
          {localize('TIDY5E.SheetSettings.NoTabsHint')}
        </div>
      {:else}
        {#each sheetEntries as entry (entry.id)}
          <button
            type="button"
            class={[
            'nav-tab',
            { active: entry.id === selectedId, 'has-changes': entry.hasChanges },
          ]}
            role="tab"
            aria-selected={entry.id === selectedId}
            onclick={() => selectTab(entry.id)}
          >
            {#if entry.iconClass}
              <i class={['nav-tab-icon', entry.iconClass]}></i>
            {/if}
            <span class="nav-tab-title">{entry.title}</span>
          </button>
        {/each}
      {/if}
    </div>
  </div>

  <section class="settings-pane" role="tabpanel">
    {#if selectedId === DIALOG_TAB_THEME}
      <ThemeSettingsQuadrone
        app={app.themeChildApp}
        settings={app.themeChildApp._settings}
        placeholders={app.themePlaceholders}
      />
    {:else if selectedId === DIALOG_TAB_TAB_CONFIG}
      <SheetTabConfigurationQuadrone
        app={app.tabConfigChildApp}
        config={app.tabConfigChildApp._config}
        title={app.tabConfigChildApp._inclusionTabTitle}
      />
    {:else if selectedId === DIALOG_TAB_SIDEBAR_TAB_CONFIG && app.sidebarTabConfigChildApp}
      <SheetTabConfigurationQuadrone
        app={app.sidebarTabConfigChildApp}
        config={app.sidebarTabConfigChildApp._config}
        title={app.sidebarTabConfigChildApp._inclusionTabTitle}
      />
    {:else if selectedSheetTabId === CONSTANTS.TAB_CHARACTER_ATTRIBUTES}
      <SpecialTraitsPane app={app.getOrCreateSpecialTraitsChildApp()} />
    {:else if configureSectionsApp}
      <ConfigureSections
        application={configureSectionsApp}
        title={configureSectionsApp.formTitle}
        bind:sections={configureSectionsApp.sections}
        optionGroups={configureSectionsApp.optionsGroups}
      />
    {:else}
      <PlaceholderSettingsPane
        title={selectedEntry?.title ?? ''}
        tabId={selectedId}
      />
    {/if}
  </section>
</div>
