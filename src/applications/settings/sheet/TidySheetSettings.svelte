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

<style lang="css">
  .tidy-sheet-settings {
    flex: 1;
    display: grid;
    grid-template-areas:
      'nav    body'
      'nav    buttons';
    grid-template-columns: 16rem 1fr;
    grid-template-rows: 1fr auto;
    gap: 0.5rem;
    min-height: 0;
  }

  .settings-nav {
    grid-area: nav;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    overflow-y: auto;
    padding: 0.5rem 0.25rem;
    border-right: 0.0625rem solid var(--t5e-tab-strip-border-color);
    background-color: var(--t5e-header-background);
  }

  .nav-group {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  .nav-group-header {
    text-transform: uppercase;
    font-size: var(--font-size-11);
    font-weight: 700;
    letter-spacing: 0.0625rem;
    opacity: 0.75;
    padding: 0.25rem 0.5rem 0.125rem;
  }

  .nav-tab {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.4rem 0.5rem;
    background: transparent;
    border: 0.0625rem solid transparent;
    border-radius: 0.25rem;
    text-align: left;
    font: inherit;
    color: inherit;
    cursor: pointer;
    width: 100%;

    &:hover {
      background-color: var(--t5e-tab-strip-hover-background, rgba(0, 0, 0, 0.05));
    }

    &.active {
      background-color: var(--t5e-tab-strip-active-background, rgba(0, 0, 0, 0.1));
      border-color: var(--t5e-tab-strip-active-border-color, transparent);
      font-weight: 600;
    }
  }

  .nav-tab-icon {
    width: 1rem;
    text-align: center;
    flex-shrink: 0;
  }

  .nav-tab-title {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .nav-empty {
    padding: 0.25rem 0.5rem;
    font-style: italic;
  }

  .settings-pane {
    grid-area: body;
    overflow-y: auto;
    padding: 0.5rem 0.75rem;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }

  .button-bar {
    grid-area: buttons;
    display: flex;
    gap: 0.5rem;
    padding: 0.25rem 0.5rem 0;

    button {
      flex: 1;
    }
  }
</style>
