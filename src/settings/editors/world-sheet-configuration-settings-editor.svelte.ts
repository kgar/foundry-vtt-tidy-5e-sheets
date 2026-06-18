import type { TabConfigContextEntry } from 'src/applications/tab-configuration/tab-configuration.types';
import type { SettingsEditor } from './settings-editors.svelte';
import type {
  HeaderControlConfigContextItem,
  WorldHeaderControlConfigurationSettingsEditor,
} from './world-header-control-configuration-settings-editor.svelte';
import type { WorldTabConfigurationSettingsEditor } from './world-tab-configuration-settings-editor.svelte';
import { CONSTANTS } from 'src/constants';
import { getCanonicalTabSelection } from 'src/applications/tab-configuration/tab-configuration-functions';

export type WorldSheetConfigurationContext = {
  tabConfig?: TabConfigContextEntry;
  sidebarTabConfig?: TabConfigContextEntry;
  headerControlConfig?: HeaderControlConfigContextItem;
};

type WorldSheetConfigurationSettingsEditorParams = {
  documentName: string;
  documentType: string;
  tabConfigEditor: WorldTabConfigurationSettingsEditor;
  sidebarTabConfigEditor?: WorldTabConfigurationSettingsEditor;
  headerControlsEditor: WorldHeaderControlConfigurationSettingsEditor;
};

export type WorldSheetConfigurationSettingsEditor =
  SettingsEditor<WorldSheetConfigurationContext> & {
    documentName: string;
    documentType: string;
  };

export function getWorldSheetConfigurationSettingsEditor(
  params: WorldSheetConfigurationSettingsEditorParams,
): WorldSheetConfigurationSettingsEditor {
  const {
    documentName,
    documentType,
    headerControlsEditor,
    sidebarTabConfigEditor,
    tabConfigEditor,
  } = params;

  const current = $derived<WorldSheetConfigurationContext>({
    tabConfig: tabConfigEditor.value.find(
      (c) =>
        c.documentName === documentName &&
        c.documentType === documentType &&
        !c.docTypeKeyOverride,
    ),
    sidebarTabConfig: sidebarTabConfigEditor?.value.find(
      (c) =>
        c.documentName === documentName &&
        c.documentType === documentType &&
        c.docTypeKeyOverride ===
          CONSTANTS.WORLD_TAB_CONFIG_KEY_CHARACTER_SIDEBAR,
    ),
    headerControlConfig: headerControlsEditor.value.find(
      (c) => c.documentName === documentName && c.documentType === documentType,
    ),
  });

  const original = getConfigSnapshot(current);

  let initialSnapshot = $state<string>(JSON.stringify(original));

  const hasChanges = $derived(JSON.stringify(current) !== initialSnapshot);

  function getConfigSnapshot(config: WorldSheetConfigurationContext) {
    const snapshotConfig = $state.snapshot(config);
    const data = {
      tabConfig: {
        ...(snapshotConfig.tabConfig
          ? getCanonicalTabSelection(snapshotConfig.tabConfig)
          : {}),
      },
      sidebarTabConfig: {
        ...(snapshotConfig.sidebarTabConfig
          ? getCanonicalTabSelection(snapshotConfig.sidebarTabConfig)
          : {}),
      },
      headerControlConfig: snapshotConfig.headerControlConfig,
    };

    return data;
  }

  return {
    get canUndo() {
      return this.hasChanges;
    },

    canUseDefault: true,

    documentName,

    documentType,

    get hasChanges() {
      return hasChanges;
    },

    initialize() {
        // noop
    },

    resetToDefault() {
        // todo
    },

    async save() {
        // todo
    },

    undoChanges() {
        // todo
    },

    async useDefault() {
        // todo
    },

    get value() { return current; },

    set value(value) {
        // todo
    }
  };
}
