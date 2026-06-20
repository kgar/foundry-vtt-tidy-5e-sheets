import type {
  TabConfigContextEntry,
  TabConfigSnapshot,
} from 'src/settings/editors/shared/tab-configuration.types';
import type { SettingsEditor } from './settings-editors.svelte';
import type { SheetTabsConfiguration } from 'src/settings/settings.types';
import type { Actor5e } from 'src/types/types';
import type { Item5e } from 'src/types/item.types';
import { TidyFlags } from 'src/foundry/TidyFlags';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { CharacterSheetQuadroneRuntime } from 'src/runtime/actor/CharacterSheetQuadroneRuntime.svelte';
import { NpcSheetQuadroneRuntime } from 'src/runtime/actor/NpcSheetQuadroneRuntime.svelte';
import { VehicleSheetQuadroneRuntime } from 'src/runtime/actor/VehicleSheetQuadroneRuntime.svelte';
import { GroupSheetQuadroneRuntime } from 'src/runtime/actor/GroupSheetQuadroneRuntime.svelte';
import { EncounterSheetQuadroneRuntime } from 'src/runtime/actor/EncounterSheetQuadroneRuntime.svelte';
import { CONSTANTS } from 'src/constants';
import {
  buildTabConfigMap,
  getActorTabContext,
  getInitialTabConfigContextEntry,
  getItemTabContext,
  mapTabConfigContextEntryToSnapshot,
} from 'src/settings/editors/shared/tab-configuration-functions';
import { UserSheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
import { error } from 'src/utils/logging';

export type SheetTabsConfigurationContext = {
  entry: TabConfigContextEntry;
};

type GetTabConfigFn = (actor: any) => SheetTabsConfiguration | null | undefined;
type SetTabConfigFn = (
  actor: any,
  config: SheetTabsConfiguration,
) => Promise<void> | undefined;
type GetTabContextFn = (
  doc: any,
  setting: SheetTabsConfiguration,
) => TabConfigContextEntry | undefined;

export type SheetTabsConfigurationSettingsEditor =
  SettingsEditor<SheetTabsConfigurationContext> & {
    inclusionTabTitle: string;
  };

type SheetTabsConfigurationSettingsEditorParams = {
  document: Actor5e | Item5e;
  customTabConfigProvider?: {
    getTabConfig: GetTabConfigFn;
    setTabConfig: SetTabConfigFn;
    getTabContext: GetTabContextFn;
  };
  title?: string;
  docTypeKeyOverride?: string;
};

export const SIDEBAR_EXPANDABLE_SHEET_TYPES: ReadonlySet<string> = new Set([
  CONSTANTS.SHEET_TYPE_CHARACTER,
  CONSTANTS.SHEET_TYPE_NPC,
  CONSTANTS.SHEET_TYPE_VEHICLE,
]);

export function getSheetTabsConfigurationSettingsEditor(
  params: SheetTabsConfigurationSettingsEditorParams,
): SheetTabsConfigurationSettingsEditor {
  const { document, customTabConfigProvider, docTypeKeyOverride, title } =
    params;

  const getTabConfig =
    customTabConfigProvider?.getTabConfig ?? TidyFlags.tabConfiguration.get;

  const setTabConfig =
    customTabConfigProvider?.setTabConfig ?? TidyFlags.tabConfiguration.set;

  const getTabContext =
    customTabConfigProvider?.getTabContext ?? getConfigFromRuntime;

  const inclusionTabTitle =
    title ??
    FoundryAdapter.localize('TIDY5E.TabConfiguration.Title', {
      documentName: FoundryAdapter.localize(
        `TYPES.${document.documentName}.${document.type}`,
      ),
    });

  const current = $state<SheetTabsConfigurationContext>(getConfig());

  let initialSnapshot = $state<string>(JSON.stringify(snapshotConfig(current)));

  const hasChanges = $derived(
    JSON.stringify(snapshotConfig(current)) !== initialSnapshot,
  );

  function snapshotConfig(config: SheetTabsConfigurationContext) {
    const entry = $state.snapshot(config).entry;
    return mapTabConfigContextEntryToSnapshot(entry);
  }

  function getConfigFromRuntime(doc: any, setting: SheetTabsConfiguration) {
    if (doc.documentName === CONSTANTS.DOCUMENT_NAME_ACTOR) {
      const runtime = getActorRuntime(doc.type);
      if (runtime) {
        return getActorTabContext(
          runtime,
          doc.type,
          setting,
          true,
          docTypeKeyOverride,
        );
      }
    }

    if (doc.documentName === CONSTANTS.DOCUMENT_NAME_ITEM) {
      return getItemTabContext(doc.type, setting, true);
    }
  }

  function getActorRuntime(type: string) {
    return type === CONSTANTS.SHEET_TYPE_CHARACTER
      ? CharacterSheetQuadroneRuntime
      : type === CONSTANTS.SHEET_TYPE_NPC
        ? NpcSheetQuadroneRuntime
        : type === CONSTANTS.SHEET_TYPE_VEHICLE
          ? VehicleSheetQuadroneRuntime
          : type === CONSTANTS.SHEET_TYPE_GROUP
            ? GroupSheetQuadroneRuntime
            : type === CONSTANTS.SHEET_TYPE_ENCOUNTER
              ? EncounterSheetQuadroneRuntime
              : undefined;
  }

  function supportsSidebarExpanded(): boolean {
    return (
      !docTypeKeyOverride &&
      document?.documentName === CONSTANTS.DOCUMENT_NAME_ACTOR &&
      SIDEBAR_EXPANDABLE_SHEET_TYPES.has(document.type)
    );
  }

  /** The default sidebar-expanded state for a tab. */
  function getDefaultSidebarExpanded(tabId: string): boolean {
    if (document?.type === CONSTANTS.SHEET_TYPE_CHARACTER) {
      return tabId !== CONSTANTS.TAB_CHARACTER_ATTRIBUTES;
    }
    return false;
  }

  /**
   * Populate {@link TabConfigContextEntry.sidebarExpandedByTabId} for every
   * registered tab, either from the saved config or from defaults.
   */
  function seedSidebarExpanded(
    entry: TabConfigContextEntry,
    { useDefaults }: { useDefaults: boolean },
  ) {
    if (!supportsSidebarExpanded()) {
      return;
    }

    const type = document.type;
    const map: Record<string, boolean> = {};
    for (const tabId of Object.keys(entry.allTabs)) {
      const fallback = getDefaultSidebarExpanded(tabId);
      if (useDefaults) {
        map[tabId] = fallback;
        continue;
      }
      const saved = UserSheetPreferencesService.getDocumentTypeTabPreference<
        'sidebarExpanded',
        boolean
      >(type, tabId, 'sidebarExpanded');
      map[tabId] = saved ?? fallback;
    }
    entry.sidebarExpandedByTabId = map;
  }

  /**
   * Save changed sidebar-expanded values to the user's saved config, then
   * update the initial state.
   */
  async function applySidebarExpanded(entry: TabConfigContextEntry) {
    const initial = JSON.parse(initialSnapshot) as SheetTabsConfigurationContext;

    const staged = entry.sidebarExpandedByTabId;
    if (!staged || !supportsSidebarExpanded()) {
      return;
    }

    const type = document.type;
    const baseline = initial.entry.sidebarExpandedByTabId ?? {};
    for (const [tabId, expanded] of Object.entries(staged)) {
      if (baseline[tabId] !== expanded) {
        await UserSheetPreferencesService.setDocumentTypeTabPreference(
          type,
          tabId,
          'sidebarExpanded',
          expanded,
        );
      }
    }
  }

  function getConfig(): SheetTabsConfigurationContext {
    let setting = getTabConfig(document);
    setting ??= { selected: [], visibilityLevels: {} };
    setting.selected ??= [];
    setting.visibilityLevels ??= {};

    const context = getTabContext(document, setting);

    if (!context) {
      error(
        `An error occurred while loading tab configuration for this sheet. The sheet type is not supported. Document Name: ${document.documentName} | Document Type: ${document.type}`,
      );
      throw new Error(
        `Tab Configuration: Sheet type ${document.type} not supported`,
      );
    }

    // Set sidebar-expanded state from saved config and capture the niitial
    seedSidebarExpanded(context, { useDefaults: false });

    return { entry: context };
  }

  return {
    get hasChanges() {
      return hasChanges;
    },

    get canUndo() {
      return this.hasChanges;
    },

    canUseDefault: true,

    resetToDefault() {
      const defaultEntry = getTabContext(document, {
        selected: [],
        visibilityLevels: {},
      });

      if (defaultEntry) {
        // Re-seed initial expanded state on reset.
        seedSidebarExpanded(defaultEntry, { useDefaults: true });
        this.value.entry = defaultEntry;
      }
    },

    async save() {
      let curr = this.value.entry;

      let selectedIds = curr.tabs.filter((t) => t.show).map((t) => t.id);

      // When the current congfiguration exactly matches the default,
      // empty out the settings so that we use defaults.
      let matchesDefault =
        curr.tabs.length === curr.defaultTabs.length &&
        curr.tabs.every((t, i) => {
          const d = curr.defaultTabs[i];
          return d && d.id === t.id && d.show === t.show;
        });

      await setTabConfig(document, {
        // Legacy fields kept in sync for the sheet runtimes (visible tabs, in order).
        // TODO: Migrate off legacy selected/unselected arrays.
        selected: matchesDefault ? [] : selectedIds,
        visibilityLevels: this.value.entry.visibilityLevels.reduce(
          (prev, curr) => {
            prev[curr.id] = curr.visibilityLevel;
            return prev;
          },
          {} as Record<string, number | null>,
        ),
        // Full per-tab arrangement (preserves hidden-tab order).
        tabs: matchesDefault
          ? {}
          : buildTabConfigMap(curr.tabs, curr.visibilityLevels),
      });

      await applySidebarExpanded(curr);

      this.value = getConfig();
      initialSnapshot = JSON.stringify(snapshotConfig(this.value));
    },

    undoChanges() {
      const initial = JSON.parse(initialSnapshot) as TabConfigSnapshot;

      this.value.entry = getInitialTabConfigContextEntry(
        [initial],
        this.value.entry,
      );
    },

    async useDefault() {
      const proceed = await foundry.applications.api.DialogV2.confirm({
        window: {
          title: FoundryAdapter.localize('TIDY5E.UseDefaultDialog.title'),
        },
        content: `<p>${FoundryAdapter.localize(
          'TIDY5E.UseDefaultDialog.text',
        )}</p>`,
      });

      if (!proceed) {
        return;
      }

      this.resetToDefault();
    },

    get value() {
      return current;
    },

    set value(value) {
      current.entry = value.entry;
    },

    inclusionTabTitle,
  };
}
