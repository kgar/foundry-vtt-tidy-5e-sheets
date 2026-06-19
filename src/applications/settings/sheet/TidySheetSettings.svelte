<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import {
    TidySheetSettingsTabIds,
    type TidySheetSettingsQuadroneApplication,
  } from './TidySheetSettingsQuadroneApplication.svelte';
  import BasicTabSettingsPane from './tabs/BasicTabSettingsPane.svelte';
  import SpecialTraitsPane from './tabs/SpecialTraitsPane.svelte';
  import SpellSourceAssignmentsPane from './tabs/SpellSourceAssignmentsPane.svelte';
  import ThemeSettingsQuadrone from 'src/applications/settings/theme/ThemeSettingsQuadrone.svelte';
  import SheetTabConfigurationQuadrone from 'src/applications/settings/tab-configuration/SheetTabConfigurationQuadrone.svelte';
  import SheetHeaderControlConfig from 'src/applications/settings/header-control-configuration/SheetHeaderControlConfig.svelte';
  import ConfigureSections from 'src/applications/settings/configure-sections/ConfigureSections.svelte';
  import SettingsFooter from 'src/applications/settings/SettingsFooter.svelte';
  import { CONSTANTS } from 'src/constants';
  import { arrayMove } from 'src/utils/array';

  interface Props {
    app: TidySheetSettingsQuadroneApplication;
  }

  let { app }: Props = $props();

  const localize = FoundryAdapter.localize;

  const SETTINGS_THEME = TidySheetSettingsTabIds.theme;
  const SETTINGS_TAB_CONFIG = TidySheetSettingsTabIds.tabConfig;
  const SETTINGS_SPECIAL_TRAITS = TidySheetSettingsTabIds.specialTraits;
  const SETTINGS_HEADER_CONTROLS = TidySheetSettingsTabIds.headerControls;
  const SETTINGS_SIDEBAR_TAB_CONFIG = TidySheetSettingsTabIds.sidebarTabConfig;
  const SETTINGS_SPELL_ASSIGNMENTS = TidySheetSettingsTabIds.spellAssignments;

  type SettingsTab = {
    id: string;
    title: string;
    iconClass?: string;
    hasChanges?: boolean;
    tabHidden?: boolean;
  };

  let headerControlEntry = $derived(app.headerControlEntry);

  let sheetName = $derived(
    localize(`TYPES.${app.document.documentName}.${app.document.type}`),
  );

  let sheetConfigOptions: SettingsTab[] = $derived([
    {
      id: SETTINGS_THEME,
      title: localize('TIDY5E.ThemeSettings.SheetMenu.buttonLabel'),
      iconClass: 'fa-solid fa-swatchbook',
      hasChanges: app.themeSettingsTab?.hasChanges,
    },
    {
      id: SETTINGS_TAB_CONFIG,
      title: localize('TIDY5E.TabConfiguration.buttonLabel'),
      iconClass: 'fas fa-file-invoice',
      hasChanges: app.tabDisplaySettingsTab?.hasChanges,
    },
    ...(app.specialTraitsChildApp
      ? [
          {
            id: SETTINGS_SPECIAL_TRAITS,
            title: localize('DND5E.SpecialTraits'),
            iconClass: 'fa-solid fa-star',
          },
        ]
      : []),
    ...(app.headerControlsTab && headerControlEntry
      ? [
          {
            id: SETTINGS_HEADER_CONTROLS,
            title: localize(
              'TIDY5E.SettingsMenu.HeaderControlConfiguration.buttonLabel',
            ),
            iconClass: 'fas fa-ellipsis-vertical',
            hasChanges: app.headerControlsTab.hasChanges,
          },
        ]
      : []),
    ...(app.spellSourceItemAssignmentsChildApp
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
  ]);

  let allAvailableTabs: SettingsTab[] = $derived([
    ...sheetConfigOptions,
    ...app.tabConfigOptions,
  ]);

  let selectedId: string = $derived(app.currentTabId ?? SETTINGS_THEME);

  let activeSelectedId: string = $derived(
    allAvailableTabs.some((e) => e.id === selectedId)
      ? selectedId
      : (allAvailableTabs[0]?.id ?? SETTINGS_THEME),
  );

  let selectedEntry: SettingsTab | undefined = $derived(
    allAvailableTabs.find((e) => e.id === activeSelectedId),
  );

  let selectedSheetTabId: string | undefined = $derived(
    activeSelectedId.slice('sheet:'.length),
  );

  let configureSectionsApp = $derived(
    app.configureSectionsChildAppByTabId.get(selectedSheetTabId),
  );

  function selectTab(id: string) {
    app.selectTab(id);
  }

  // Drag to reorder, with a drop indicator centered in the gap between rows.

  // Vertical gap between nav rows, in px (sync with `.nav-tab-list` gap).
  const ROW_GAP = 2;

  let rowElements: HTMLButtonElement[] = $state([]);
  let draggedTabIndex = $state<number | null>(null);
  let dropIndicatorIndex = $state<number | null>(null);

  // The indicator's y-offset, centered in the gap before `dropIndicatorIndex`
  let dropLineTop = $derived.by(() => {
    if (dropIndicatorIndex === null) {
      return null;
    }

    if (dropIndicatorIndex < app.tabConfigOptions.length) {
      const el = rowElements[dropIndicatorIndex];
      return el ? el.offsetTop - ROW_GAP / 2 : null;
    }

    const el = rowElements[app.tabConfigOptions.length - 1];
    return el ? el.offsetTop + el.offsetHeight + ROW_GAP / 2 : null;
  });

  function onTabDragStart(ev: DragEvent, index: number) {
    draggedTabIndex = index;
    ev.dataTransfer?.setData('text/plain', index.toString());
    if (ev.dataTransfer) {
      ev.dataTransfer.effectAllowed = 'move';
    }
  }

  // Target the entire list. The drop zone is midway between each row.
  function onListDragOver(ev: DragEvent) {
    ev.preventDefault();

    const y = ev.clientY;
    let gap = app.tabConfigOptions.length;
    for (let i = 0; i < app.tabConfigOptions.length; i++) {
      const rect = rowElements[i]?.getBoundingClientRect();
      if (rect && y < rect.top + rect.height / 2) {
        gap = i;
        break;
      }
    }

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

    /** Removing the dragged item shifts later positions down by one. */
    const target = gap > draggedIndex ? gap - 1 : gap;
    if (target === draggedIndex) {
      return;
    }

    const tabApp = app.tabDisplaySettingsTab;
    if (!tabApp) {
      return;
    }

    // Reorder the tab list so hidden tabs keep their relative before `apply()`
    const entry = tabApp.value.entry;
    arrayMove(entry.tabs, draggedIndex, target);
    entry.tabs = entry.tabs;

    // Reordering persists immediately rather than waiting for a Save click.
    await tabApp.save();
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
        {localize('TIDY5E.SheetSettings.Group.Tabs')}
      </h3>
      {#if app.tabConfigOptions.length === 0}
        <div class="nav-empty hint">
          {localize('TIDY5E.SheetSettings.NoTabsHint')}
        </div>
      {:else}
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
          class="nav-tab-list"
          ondragover={onListDragOver}
          ondrop={onTabDrop}
        >
          {#each app.tabConfigOptions as entry, i (entry.id)}
            <button
              bind:this={rowElements[i]}
              type="button"
              class={[
                'nav-tab',
                {
                  active: entry.id === activeSelectedId,
                  'has-changes': entry.hasChanges,
                  'tab-hidden': entry.tabHidden,
                  dragging: draggedTabIndex === i,
                },
              ]}
              role="tab"
              aria-selected={entry.id === activeSelectedId}
              draggable="true"
              onclick={() => selectTab(entry.id)}
              ondragstart={(ev) => onTabDragStart(ev, i)}
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
              <i
                class="tab-icon tab-drag-icon fa-solid fa-grip-lines fa-fw"
                aria-hidden="true"
              ></i>
            </button>
          {/each}
          {#if dropLineTop !== null}
            <div
              class="drop-line"
              style="top: {dropLineTop}px"
              role="presentation"
              aria-hidden="true"
            ></div>
          {/if}
        </div>
      {/if}
    </div>
  </div>

  <section class="settings-pane" role="tabpanel">
    {#if activeSelectedId === SETTINGS_THEME && app.themeSettingsTab}
      <ThemeSettingsQuadrone
        app={app.themeSettingsTab}
        placeholders={undefined}
      />
      <!-- TODO: Deal with the undefined placeholders. They are unused. -->
    {:else if activeSelectedId === SETTINGS_TAB_CONFIG && app.tabDisplaySettingsTab}
      <SheetTabConfigurationQuadrone app={app.tabDisplaySettingsTab} />
    {:else if activeSelectedId === SETTINGS_HEADER_CONTROLS && headerControlEntry}
      <div class="dialog-content-container flexcol">
        <h2>
          {localize('TIDY5E.SettingsMenu.HeaderControlConfiguration.name')}
        </h2>
        <p class="settings-description">
          {localize('TIDY5E.SheetSettings.HeaderControls.WorldSettingHint', {
            sheetName,
          })}
          <!-- svelte-ignore a11y_invalid_attribute -->
          <a
            tabindex="0"
            href="javascript:void(0)"
            role="button"
            aria-label={localize(
              'TIDY5E.SheetSettings.HeaderControls.OpenWorldSettings',
            )}
            class="inline-link"
            onclick={() => app.openWorldHeaderControlSettings()}
            onkeydown={(ev) => {
              if (ev.key === 'Enter' || ev.key === ' ') {
                ev.preventDefault();
                app.openWorldHeaderControlSettings();
              }
            }}
          >
            {localize('TIDY5E.SheetSettings.HeaderControls.OpenWorldSettings')}
          </a>
        </p>
        <SheetHeaderControlConfig
          config={headerControlEntry}
          idPrefix={`${app.id}-header-controls`}
        />
      </div>
    {:else if activeSelectedId === SETTINGS_SIDEBAR_TAB_CONFIG && app.sidebarTabDisplaySettingsTab}
      <SheetTabConfigurationQuadrone app={app.sidebarTabDisplaySettingsTab} />
    {:else if activeSelectedId === SETTINGS_SPELL_ASSIGNMENTS && app.spellSourceItemAssignmentsChildApp}
      <SpellSourceAssignmentsPane
        app={app.spellSourceItemAssignmentsChildApp}
      />
    {:else if activeSelectedId === SETTINGS_SPECIAL_TRAITS && app.specialTraitsChildApp}
      <SpecialTraitsPane app={app.specialTraitsChildApp} />
    {:else if selectedSheetTabId === CONSTANTS.TAB_CHARACTER_ATTRIBUTES && app.specialTraitsChildApp}
      <SpecialTraitsPane
        app={app.specialTraitsChildApp}
        tabId={selectedSheetTabId}
        bind:tabConfigEntry={app.tabDisplaySettingsTab.value.entry}
      />
    {:else if configureSectionsApp && app.tabDisplaySettingsTab}
      <ConfigureSections
        application={configureSectionsApp}
        title={configureSectionsApp.formTitle}
        bind:sections={configureSectionsApp.value.sections}
        optionGroups={configureSectionsApp.value.optionsGroups}
        bind:tabConfigEntry={app.tabDisplaySettingsTab.value.entry}
        tabId={selectedSheetTabId}
      />
    {:else if app.tabDisplaySettingsTab}
      <BasicTabSettingsPane
        title={selectedEntry?.title ?? ''}
        tabId={selectedSheetTabId}
        bind:tabConfigEntry={app.tabDisplaySettingsTab.value.entry}
      />
    {/if}
  </section>

  <!-- One footer for the deferred-save panes. Section editors / spell
       assignments report no active pane and keep their own in-pane controls. -->
  {const activePane = $derived(app.getActivePane())}
  {#if activePane}
    <SettingsFooter host={activePane} save={() => app.save()} />
  {/if}
</div>
