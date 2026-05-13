<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type {
    TidySheetSettingsContext,
    TidySheetSettingsQuadroneApplication,
    TidySheetSettingsTabInfo,
  } from './TidySheetSettingsQuadroneApplication.svelte';
  import PlaceholderSettingsPane from './tabs/PlaceholderSettingsPane.svelte';
  import ThemeSettingsPane from './tabs/ThemeSettingsPane.svelte';
  import TabConfigurationPane from './tabs/TabConfigurationPane.svelte';

  interface Props {
    app: TidySheetSettingsQuadroneApplication;
    config: TidySheetSettingsContext;
  }

  let { app, config }: Props = $props();

  const localize = FoundryAdapter.localize;

  const DIALOG_TAB_THEME = 'dialog:theme';
  const DIALOG_TAB_TAB_CONFIG = 'dialog:tab-config';
  const DIALOG_TAB_CUSTOM_TABS = 'dialog:custom-tabs';

  type SidebarEntry = {
    id: string;
    title: string;
    iconClass?: string;
  };

  let dialogEntries: SidebarEntry[] = [
    {
      id: DIALOG_TAB_THEME,
      title: localize('TIDY5E.ThemeSettings.SheetMenu.name'),
      iconClass: 'fa-solid fa-swatchbook',
    },
    {
      id: DIALOG_TAB_TAB_CONFIG,
      title: localize('TIDY5E.TabConfiguration.MenuOptionText'),
      iconClass: 'fas fa-file-invoice',
    },
    {
      id: DIALOG_TAB_CUSTOM_TABS,
      title: localize('TIDY5E.SheetSettings.CustomTabs.label'),
      iconClass: 'fa-solid fa-table-columns',
    },
  ];

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

  let selectedId: string = $state(DIALOG_TAB_THEME);

  $effect(() => {
    if (!allEntries.some((e) => e.id === selectedId)) {
      selectedId = allEntries[0]?.id ?? DIALOG_TAB_THEME;
    }
  });

  let selectedEntry: SidebarEntry | undefined = $derived(
    allEntries.find((e) => e.id === selectedId),
  );

  function selectTab(id: string) {
    selectedId = id;
  }
</script>

<div class="tidy-sheet-settings">
  <nav class="settings-nav" role="tablist" aria-orientation="vertical">
    <div class="nav-group">
      <div class="nav-group-header">
        {localize('TIDY5E.SheetSettings.Group.Dialogs')}
      </div>
      {#each dialogEntries as entry (entry.id)}
        <button
          type="button"
          class={['nav-tab', { active: entry.id === selectedId }]}
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
      <div class="nav-group-header">
        {localize('TIDY5E.SheetSettings.Group.Tabs')}
      </div>
      {#if sheetEntries.length === 0}
        <div class="nav-empty hint">
          {localize('TIDY5E.SheetSettings.NoTabsHint')}
        </div>
      {:else}
        {#each sheetEntries as entry (entry.id)}
          <button
            type="button"
            class={['nav-tab', { active: entry.id === selectedId }]}
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
  </nav>

  <section class="settings-pane" role="tabpanel">
    {#if selectedId === DIALOG_TAB_THEME}
      <ThemeSettingsPane {app} />
    {:else if selectedId === DIALOG_TAB_TAB_CONFIG}
      <TabConfigurationPane {app} />
    {:else}
      <PlaceholderSettingsPane
        title={selectedEntry?.title ?? ''}
        tabId={selectedId}
      />
    {/if}
  </section>
<!-- 
  <div class="button-bar">
    <button
      type="button"
      class="button button-secondary button-large cancel-btn"
      onclick={() => app.cancel()}
    >
      {localize('Cancel')}
    </button>
    <button
      type="button"
      class="button button-primary button-large button-save save-changes-btn"
      onclick={() => app.save()}
    >
      <i class="fas fa-save"></i>
      {localize('TIDY5E.SaveChanges')}
    </button>
  </div> -->
</div>
