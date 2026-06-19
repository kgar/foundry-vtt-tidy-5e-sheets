<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import {
    WorldSettingsTabIds,
    type WorldSettingsContext,
    type WorldSettingsQuadroneApplication,
  } from './TidyWorldSettingsQuadroneApplication.svelte';
  import WorldSettingsOverview from 'src/applications/settings/world-settings-overview/WorldSettingsOverview.svelte';
  import ThemeSettingsQuadrone from 'src/applications/theme/ThemeSettingsQuadrone.svelte';
  import HomebrewSettings from 'src/applications/homebrew-settings/HomebrewSettings.svelte';
  import ApplyTidySheetPreferences from 'src/applications/sheet-preferences/ApplyTidySheetPreferences.svelte';
  import WorldSheetSettings from './WorldSheetSettings.svelte';
  import SettingsFooter from 'src/applications/settings/SettingsFooter.svelte';

  interface Props {
    app: WorldSettingsQuadroneApplication;
    config: WorldSettingsContext;
  }

  let { app }: Props = $props();

  const localize = FoundryAdapter.localize;

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
    hasChanges?: boolean;
  };

  type SheetSettingsTab = SettingsTab & {
    orderKey: string;
  };

  let worldConfigOptions: SettingsTab[] = $derived([
    {
      id: WorldSettingsTabIds.defaults,
      title: localize('TIDY5E.WorldSettings.Menu.tabLabel'),
      iconClass: 'fa-solid fa-house',
    },
    {
      id: WorldSettingsTabIds.sheetPreferences,
      title: localize('TIDY5E.WorldSettings.SheetPreferences.tabLabel'),
      iconClass: 'fa-solid fa-scroll',
    },
    {
      id: WorldSettingsTabIds.theme,
      title: localize('TIDY5E.WorldSettings.GlobalTheme.tabLabel'),
      iconClass: 'fa-solid fa-swatchbook',
      hasChanges: app.editors.themeSettingsTab.hasChanges,
    },
    {
      id: WorldSettingsTabIds.homebrew,
      title: localize('TIDY5E.WorldSettings.Homebrew.tabLabel'),
      iconClass: 'fa-solid fa-beer-mug',
      hasChanges: app.editors.homebrewTab.hasChanges,
    },
  ]);

  // Each Tidy sheet type becomes its own tab. The list of available sheets is
  // shared with the header control configuration tab.
  let sheetConfigOptions: SheetSettingsTab[] = $derived(
    app.editors.headerControlsTab.value.map((config) => ({
      id: app.getSheetConfigTabId(config.documentName, config.documentType),
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

  let selectedId: string = $derived(
    app.currentTabId ?? WorldSettingsTabIds.defaults,
  );

  let activeSelectedId: string = $derived(
    allAvailableTabs.some((e) => e.id === selectedId)
      ? selectedId
      : (allAvailableTabs[0]?.id ?? WorldSettingsTabIds.defaults),
  );

  let selectedSheetConfigEditor = $derived(
    app.sheetConfigEditors[activeSelectedId]
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
          class={[
            'nav-tab',
            {
              active: entry.id === activeSelectedId,
              'has-changes': entry.hasChanges,
            },
          ]}
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
    {#if activeSelectedId === WorldSettingsTabIds.defaults}
      <WorldSettingsOverview {app} />
    {:else if activeSelectedId === WorldSettingsTabIds.theme}
      <ThemeSettingsQuadrone
        app={app.editors.themeSettingsTab}
        placeholders={undefined}
      />
    {:else if activeSelectedId === WorldSettingsTabIds.homebrew}
      <HomebrewSettings app={app.editors.homebrewTab} />
    {:else if activeSelectedId === WorldSettingsTabIds.sheetPreferences}
      <ApplyTidySheetPreferences
        onMakeAllSheetsTidy={async () => await app.save()}
        options={app.editors.sheetPreferencesTab.value}
      />
    {:else if selectedSheetConfigEditor}
      <WorldSheetSettings
        {app}
        editor={selectedSheetConfigEditor}
      />
    {/if}
  </section>

  {const activePane = $derived(app.getActivePane())}
  {#if activePane}
    <SettingsFooter host={activePane} onSave={() => app.save()} />
  {/if}
</div>
