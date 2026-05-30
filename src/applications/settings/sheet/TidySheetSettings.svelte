<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import {
    TidySheetSettingsTabIds,
    type TidySheetSettingsContext,
    type TidySheetSettingsQuadroneApplication,
    type TidySheetSettingsTabInfo,
  } from './TidySheetSettingsQuadroneApplication.svelte';
  import PlaceholderSettingsPane from './tabs/PlaceholderSettingsPane.svelte';
  import SpecialTraitsPane from './tabs/SpecialTraitsPane.svelte';
  import SpellSourceAssignmentsPane from './tabs/SpellSourceAssignmentsPane.svelte';
  import ThemeSettingsQuadrone from 'src/applications/theme/ThemeSettingsQuadrone.svelte';
  import SheetTabConfigurationQuadrone from 'src/applications/tab-configuration/SheetTabConfigurationQuadrone.svelte';
  import ConfigureSections from 'src/applications-quadrone/configure-sections/ConfigureSections.svelte';
  import { CONSTANTS } from 'src/constants';
  import { arrayMove } from 'src/utils/array';

  interface Props {
    app: TidySheetSettingsQuadroneApplication;
    config: TidySheetSettingsContext;
  }

  let { app, config }: Props = $props();

  const localize = FoundryAdapter.localize;

  const SETTINGS_THEME = TidySheetSettingsTabIds.theme;
  const SETTINGS_TAB_CONFIG = TidySheetSettingsTabIds.tabConfig;
  const SETTINGS_SIDEBAR_TAB_CONFIG = TidySheetSettingsTabIds.sidebarTabConfig;
  const SETTINGS_SPELL_ASSIGNMENTS = TidySheetSettingsTabIds.spellAssignments;

  type SettingsTab = {
    id: string;
    title: string;
    iconClass?: string;
    hasChanges?: boolean;
    tabHidden?: boolean;
  };

  let spellAssignmentsApp = $derived(app.getSpellSourceItemAssignmentsTab());

  let sheetConfigOptions: SettingsTab[] = $derived(
    [
      {
        id: SETTINGS_THEME,
        title: localize('TIDY5E.ThemeSettings.SheetMenu.name'),
        iconClass: 'fa-solid fa-swatchbook',
        hasChanges: app.themeSettingsTab.hasChanges,
      },
      {
        id: SETTINGS_TAB_CONFIG,
        title: localize('TIDY5E.TabConfiguration.MenuOptionText'),
        iconClass: 'fas fa-file-invoice',
        hasChanges: app.tabDisplaySettingsTab.hasChanges,
      },
      ...(spellAssignmentsApp
        ? [
            {
              id: SETTINGS_SPELL_ASSIGNMENTS,
              title: localize('TIDY5E.Utilities.AssignSpellsToClasses'),
              iconClass: 'fa-solid fa-list-check',
            },
          ]
        : []),
      ...(app.sidebarTabDisplaySettingsTab
        ? [
            {
              id: SETTINGS_SIDEBAR_TAB_CONFIG,
              title: localize('TIDY5E.Character.Sidebar.Title'),
              iconClass: 'fas fa-sidebar',
              hasChanges: app.sidebarTabDisplaySettingsTab.hasChanges,
            },
          ]
        : []),
    ],
  );

  let tabConfigOptions: SettingsTab[] = $derived(
    config.parentSheetTabs.map((t: TidySheetSettingsTabInfo) => ({
      id: `sheet:${t.id}`,
      title: t.title,
      iconClass: t.iconClass,
      tabHidden: t.tabHidden,
    })),
  );

  let allAvailableTabs: SettingsTab[] = $derived([
    ...sheetConfigOptions,
    ...tabConfigOptions,
  ]);

  let selectedId: string = $derived(
    app.currentTabId ?? SETTINGS_THEME,
  );

  let activeSelectedId: string = $derived(
    allAvailableTabs.some((e) => e.id === selectedId)
      ? selectedId
      : allAvailableTabs[0]?.id ?? SETTINGS_THEME,
  );

  let selectedEntry: SettingsTab | undefined = $derived(
    allAvailableTabs.find((e) => e.id === activeSelectedId),
  );

  let selectedSheetTabId: string | undefined = $derived(
    activeSelectedId.slice('sheet:'.length)
  );

  let configureSectionsApp = $derived(
    app.getConfigureSectionsConfigTab(selectedSheetTabId)
  );

  function selectTab(id: string) {
    app.selectTab(id);
  }

  let draggedTabIndex = $state<number | null>(null);
  let dropIndicatorIndex = $state<number | null>(null);

  function onTabDragStart(ev: DragEvent, index: number) {
    draggedTabIndex = index;
    ev.dataTransfer?.setData('text/plain', index.toString());
    if (ev.dataTransfer) {
      ev.dataTransfer.effectAllowed = 'move';
    }
  }

  function onTabDragOver(ev: DragEvent, index: number) {
    // Hidden tabs can't be reordered, so they aren't valid drop targets.
    if (config.parentSheetTabs[index]?.tabHidden) {
      dropIndicatorIndex = null;
      return;
    }

    ev.preventDefault();

    const rect = (ev.currentTarget as HTMLElement).getBoundingClientRect();
    const after = ev.clientY > rect.top + rect.height / 2;
    const gap = after ? index + 1 : index;

    // Hide the indicator when the drop would be a no-op (dropping next to self).
    if (
      draggedTabIndex !== null &&
      (gap === draggedTabIndex || gap === draggedTabIndex + 1)
    ) {
      dropIndicatorIndex = null;
      return;
    }

    dropIndicatorIndex = gap;
  }

  function onTabDragEnd() {
    draggedTabIndex = null;
    dropIndicatorIndex = null;
  }

  async function onTabDrop(ev: DragEvent) {
    ev.preventDefault();
    ev.stopPropagation();

    const draggedIndex = parseInt(ev.dataTransfer?.getData('text/plain') ?? '');
    const gap = dropIndicatorIndex;
    draggedTabIndex = null;
    dropIndicatorIndex = null;

    if (isNaN(draggedIndex) || gap === null) {
      return;
    }

    // Removing the dragged item shifts later positions down by one.
    const target = gap > draggedIndex ? gap - 1 : gap;
    if (target === draggedIndex) {
      return;
    }

    arrayMove(config.parentSheetTabs, draggedIndex, target);
    config.parentSheetTabs = config.parentSheetTabs;

    updateTabOrder();

    // Reordering persists immediately rather than waiting for a Save click.
    await app.tabDisplaySettingsTab.apply();
  }

  // Reorder the saved tab selection to match the new display order.
  function updateTabOrder() {
    const entry = app.tabDisplaySettingsTab._config.entry;
    const orderIndex = new Map(
      config.parentSheetTabs.map((t, i) => [t.id, i]),
    );
    entry.selected = [...entry.selected].sort(
      (a, b) => (orderIndex.get(a.id) ?? 0) - (orderIndex.get(b.id) ?? 0),
    );
  }
</script>

<div class="tidy-sheet-settings">
  <div class="settings-nav" role="tablist" aria-orientation="vertical">
    <div class="nav-group">
      <h3 class="nav-group-header">
        {localize('TIDY5E.SheetSettings.Group.SheetSettings')}
      </h3>
      {#each sheetConfigOptions as entry (entry.id)}
        <button
          type="button"
          class={[
            'nav-tab',
            { active: entry.id === activeSelectedId, 'has-changes': entry.hasChanges },
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
        {localize('TIDY5E.SheetSettings.Group.Tabs')}
      </h3>
      {#if tabConfigOptions.length === 0}
        <div class="nav-empty hint">
          {localize('TIDY5E.SheetSettings.NoTabsHint')}
        </div>
      {:else}
        {#each tabConfigOptions as entry, i (entry.id)}
          <button
            type="button"
            class={[
              'nav-tab',
              {
                active: entry.id === activeSelectedId,
                'has-changes': entry.hasChanges,
                'tab-hidden': entry.tabHidden,
                dragging: draggedTabIndex === i,
                'drop-indicator-above': dropIndicatorIndex === i,
                'drop-indicator-below':
                  dropIndicatorIndex === tabConfigOptions.length &&
                  i === tabConfigOptions.length - 1,
              },
            ]}
            role="tab"
            aria-selected={entry.id === activeSelectedId}
            draggable={!entry.tabHidden}
            onclick={() => selectTab(entry.id)}
            ondragstart={(ev) => onTabDragStart(ev, i)}
            ondragover={(ev) => onTabDragOver(ev, i)}
            ondrop={(ev) => onTabDrop(ev)}
            ondragend={onTabDragEnd}
          >
            {#if entry.iconClass}
              <i class={['nav-tab-icon', entry.iconClass]}></i>
            {/if}
            <span class="nav-tab-title">{entry.title}</span>
            {#if entry.tabHidden}
              <i
                class="tab-icon tab-visibility-icon fa-solid fa-eye-slash fa-fw"
                aria-hidden="true"
              ></i>
            {/if}
            {#if !entry.tabHidden}
              <i
                class="tab-icon tab-drag-icon fa-solid fa-grip-lines fa-fw"
                aria-hidden="true"
              ></i>
            {/if}
          </button>
        {/each}
      {/if}
    </div>
  </div>

  <section class="settings-pane" role="tabpanel">
    {#if activeSelectedId === SETTINGS_THEME}
      <ThemeSettingsQuadrone
        app={app.themeSettingsTab}
        settings={app.themeSettingsTab._settings}
        placeholders={app.themePlaceholders}
      />
    {:else if activeSelectedId === SETTINGS_TAB_CONFIG}
      <SheetTabConfigurationQuadrone
        app={app.tabDisplaySettingsTab}
        config={app.tabDisplaySettingsTab._config}
        title={app.tabDisplaySettingsTab._inclusionTabTitle}
      />
    {:else if activeSelectedId === SETTINGS_SIDEBAR_TAB_CONFIG && app.sidebarTabDisplaySettingsTab}
      <SheetTabConfigurationQuadrone
        app={app.sidebarTabDisplaySettingsTab}
        config={app.sidebarTabDisplaySettingsTab._config}
        title={app.sidebarTabDisplaySettingsTab._inclusionTabTitle}
      />
    {:else if activeSelectedId === SETTINGS_SPELL_ASSIGNMENTS && spellAssignmentsApp}
      <SpellSourceAssignmentsPane app={spellAssignmentsApp} />
    {:else if selectedSheetTabId === CONSTANTS.TAB_CHARACTER_ATTRIBUTES}
      <SpecialTraitsPane
        app={app.getSpecialTraitsConfigTab()}
        tabId={selectedSheetTabId}
        tabConfigEntry={app.tabDisplaySettingsTab._config.entry}
      />
    {:else if configureSectionsApp}
      <ConfigureSections
        application={configureSectionsApp}
        title={configureSectionsApp.formTitle}
        bind:sections={configureSectionsApp.sections}
        optionGroups={configureSectionsApp.optionsGroups}
        tabConfigEntry={app.tabDisplaySettingsTab._config.entry}
        tabId={selectedSheetTabId}
      />
    {:else}
      <PlaceholderSettingsPane
        {app}
        title={selectedEntry?.title ?? ''}
        tabId={selectedSheetTabId}
        tabConfigEntry={app.tabDisplaySettingsTab._config.entry}
      />
    {/if}
  </section>
</div>
