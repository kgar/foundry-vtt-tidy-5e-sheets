<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import {
    WorldSettingsTabIds,
    type WorldSettingsContext,
    type WorldSettingsQuadroneApplication,
  } from './TidyWorldSettingsQuadroneApplication.svelte';
  import WorldSettingsDefaults from 'src/applications/settings/world-settings-defaults/WorldSettingsDefaults.svelte';
  import About from 'src/applications/settings/about/About.svelte';
  import ThemeSettingsQuadrone from 'src/applications/theme/ThemeSettingsQuadrone.svelte';
  import WorldTabConfigurationQuadrone from 'src/applications/tab-configuration/WorldTabConfigurationQuadrone.svelte';
  import WorldHeaderControlConfigurationQuadrone from 'src/applications/header-control-configuration/WorldHeaderControlConfigurationQuadrone.svelte';
  import HomebrewSettings from 'src/applications/homebrew-settings/HomebrewSettings.svelte';
  import ApplyTidySheetPreferences from 'src/applications/sheet-preferences/ApplyTidySheetPreferences.svelte';

  interface Props {
    app: WorldSettingsQuadroneApplication;
    config: WorldSettingsContext;
  }

  let { app }: Props = $props();

  const localize = FoundryAdapter.localize;

  const SETTINGS_DEFAULTS = WorldSettingsTabIds.defaults;
  const SETTINGS_ABOUT = WorldSettingsTabIds.about;
  const SETTINGS_THEME = WorldSettingsTabIds.theme;
  const SETTINGS_TAB_CONFIG = WorldSettingsTabIds.tabConfig;
  const SETTINGS_HEADER_CONTROLS = WorldSettingsTabIds.headerControls;
  const SETTINGS_HOMEBREW = WorldSettingsTabIds.homebrew;
  const SETTINGS_SHEET_PREFERENCES = WorldSettingsTabIds.sheetPreferences;

  type SettingsTab = {
    id: string;
    title: string;
    iconClass?: string;
  };

  let worldConfigOptions: SettingsTab[] = $derived([
    {
      id: SETTINGS_DEFAULTS,
      title: localize('TIDY5E.WorldSettings.Menu.name'),
      iconClass: 'fa-solid fa-house',
    },
    {
      id: SETTINGS_THEME,
      title: localize('TIDY5E.SettingsMenu.WorldThemeSettings.name'),
      iconClass: 'fa-solid fa-swatchbook',
    },
    {
      id: SETTINGS_TAB_CONFIG,
      title: localize('TIDY5E.SettingsMenu.TabConfiguration.name'),
      iconClass: 'fa-solid fa-table-columns',
    },
    {
      id: SETTINGS_HEADER_CONTROLS,
      title: localize('TIDY5E.SettingsMenu.HeaderControlConfiguration.name'),
      iconClass: 'fa-solid fa-up-to-dotted-line',
    },
    {
      id: SETTINGS_HOMEBREW,
      title: localize('TIDY5E.SettingsMenu.Homebrew.name'),
      iconClass: 'fa-solid fa-beer-mug',
    },
    {
      id: SETTINGS_SHEET_PREFERENCES,
      title: localize('TIDY5E.Settings.SheetPreferences.name'),
      iconClass: 'fa-solid fa-scroll',
    },
    {
      id: SETTINGS_ABOUT,
      title: localize('TIDY5E.Settings.About.name'),
      iconClass: 'fa-solid fa-block-question',
    },
  ]);

  let sheetConfigOptions: SettingsTab[] = $derived([

  ]);

  let allAvailableTabs: SettingsTab[] = $derived([...worldConfigOptions]);

  let selectedId: string = $derived(app.currentTabId ?? SETTINGS_DEFAULTS);

  let activeSelectedId: string = $derived(
    allAvailableTabs.some((e) => e.id === selectedId)
      ? selectedId
      : allAvailableTabs[0]?.id ?? SETTINGS_DEFAULTS,
  );

  function selectTab(id: string) {
    app.selectTab(id);
  }
</script>

<div class="tidy-sheet-settings">
  <div class="settings-nav" role="tablist" aria-orientation="vertical">
    <div class="nav-group">
      <h3 class="nav-group-header">
        {localize('TIDY5E.WorldSettings.Group.TidySettings')}
      </h3>
      {#each worldConfigOptions as entry (entry.id)}
        <button
          type="button"
          class={['nav-tab', { active: entry.id === activeSelectedId }]}
          role="tab"
          aria-selected={entry.id === activeSelectedId}
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
        {localize('TIDY5E.WorldSettings.Group.Sheets')}
      </h3>
      {#each sheetConfigOptions as entry (entry.id)}
        <button
          type="button"
          class={['nav-tab', { active: entry.id === activeSelectedId }]}
          role="tab"
          aria-selected={entry.id === activeSelectedId}
          onclick={() => selectTab(entry.id)}
        >
          <span class="nav-tab-title">{entry.title}</span>
        </button>
      {/each}
    </div>
  </div>

  <section class="settings-pane" role="tabpanel">
    {#if activeSelectedId === SETTINGS_DEFAULTS}
      <WorldSettingsDefaults {app} />
    {:else if activeSelectedId === SETTINGS_THEME}
      <ThemeSettingsQuadrone
        app={app.themeSettingsTab}
        settings={app.themeSettingsTab._settings}
        placeholders={undefined}
      />
    {:else if activeSelectedId === SETTINGS_TAB_CONFIG}
      <WorldTabConfigurationQuadrone
        app={app.tabConfigTab}
        bind:config={app.tabConfigTab._config}
      />
    {:else if activeSelectedId === SETTINGS_HEADER_CONTROLS}
      <WorldHeaderControlConfigurationQuadrone
        app={app.headerControlsTab}
        bind:context={app.headerControlsTab._configs}
      />
    {:else if activeSelectedId === SETTINGS_HOMEBREW}
      <HomebrewSettings app={app.homebrewTab} config={app.homebrewTab._config} />
    {:else if activeSelectedId === SETTINGS_SHEET_PREFERENCES}
      <ApplyTidySheetPreferences
        options={app.sheetPreferencesTab.sheetOptions}
        onConfirm={() => app.sheetPreferencesTab._onConfirm()}
      />
    {:else if activeSelectedId === SETTINGS_ABOUT}
      <About />
    {/if}
  </section>
</div>
