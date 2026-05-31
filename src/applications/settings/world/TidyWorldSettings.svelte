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
  import WorldSheetSettings from './WorldSheetSettings.svelte';

  interface Props {
    app: WorldSettingsQuadroneApplication;
    config: WorldSettingsContext;
  }

  let { app }: Props = $props();

  const localize = FoundryAdapter.localize;

  // TODO: Move to constants?
  const SETTINGS_DEFAULTS = WorldSettingsTabIds.defaults;
  const SETTINGS_ABOUT = WorldSettingsTabIds.about;
  const SETTINGS_THEME = WorldSettingsTabIds.theme;
  const SETTINGS_TAB_CONFIG = WorldSettingsTabIds.tabConfig;
  const SETTINGS_HEADER_CONTROLS = WorldSettingsTabIds.headerControls;
  const SETTINGS_HOMEBREW = WorldSettingsTabIds.homebrew;
  const SETTINGS_SHEET_PREFERENCES = WorldSettingsTabIds.sheetPreferences;

  const SETTINGS_SHEET_PREFIX = 'settings:sheet';

  const ACTOR_SHEET_TAB_ORDER = [
    'Actor:character',
    'Actor:npc',
    'Actor:group',
    'Actor:encounter',
    'Actor:vehicle',
  ];

  type SettingsTab = {
    id: string;
    title: string;
    iconClass?: string;
  };

  type SheetSettingsTab = SettingsTab & {
    orderKey: string;
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

  // Each Tidy sheet type becomes its own tab. The list of available sheets is
  // shared with the header control configuration tab.
  let sheetConfigOptions: SheetSettingsTab[] = $derived(
    app.headerControlsTab._configs.map((config) => ({
      id: `${SETTINGS_SHEET_PREFIX}:${config.documentName}:${config.documentType}`,
      title: config.title,
      orderKey: `${config.documentName}:${config.documentType}`,
    })),
  );

  // Actor sheets are the ones explicitly listed in ACTOR_SHEET_TAB_ORDER, shown
  // in that order. Everything else is treated as an item sheet, sorted by title.
  let actorSheetConfigOptions: SheetSettingsTab[] = $derived(
    sheetConfigOptions
      .filter((o) => ACTOR_SHEET_TAB_ORDER.includes(o.orderKey))
      .sort(
        (a, b) =>
          ACTOR_SHEET_TAB_ORDER.indexOf(a.orderKey) -
          ACTOR_SHEET_TAB_ORDER.indexOf(b.orderKey),
      ),
  );

  let itemSheetConfigOptions: SheetSettingsTab[] = $derived(
    sheetConfigOptions
      .filter((o) => !ACTOR_SHEET_TAB_ORDER.includes(o.orderKey))
      .sort((a, b) => a.title.localeCompare(b.title, game.i18n.lang)),
  );

  let allAvailableTabs: SettingsTab[] = $derived([
    ...worldConfigOptions,
    ...sheetConfigOptions,
  ]);

  let selectedId: string = $derived(app.currentTabId ?? SETTINGS_DEFAULTS);

  let activeSelectedId: string = $derived(
    allAvailableTabs.some((e) => e.id === selectedId)
      ? selectedId
      : allAvailableTabs[0]?.id ?? SETTINGS_DEFAULTS,
  );

  let selectedSheetConfig = $derived(
    app.headerControlsTab._configs.find(
      (c) =>
        `${SETTINGS_SHEET_PREFIX}:${c.documentName}:${c.documentType}` ===
        activeSelectedId,
    ),
  );

  function selectTab(id: string) {
    app.selectTab(id);
  }</script>

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
        {localize('TIDY5E.WorldSettings.Group.ActorSheets')}
      </h3>
      {#each actorSheetConfigOptions as entry (entry.id)}
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
    <div class="nav-group">
      <h3 class="nav-group-header">
        {localize('TIDY5E.WorldSettings.Group.ItemSheets')}
      </h3>
      {#each itemSheetConfigOptions as entry (entry.id)}
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
    {:else if selectedSheetConfig}
      <WorldSheetSettings
        documentName={selectedSheetConfig.documentName}
        documentType={selectedSheetConfig.documentType}
        title={selectedSheetConfig.title}
      />
    {/if}
  </section>
</div>
