import { DocumentSheetDialog } from 'src/applications-quadrone/DocumentSheetDialog.svelte';
import type {
  DocumentSheetApplicationConfiguration,
  DocumentSheetConfiguration,
} from 'src/types/application.types';
import type { TabConfigContextEntry } from './tab-configuration.types';
import { CONSTANTS } from 'src/constants';
import SheetTabConfigurationQuadrone from './SheetTabConfigurationQuadrone.svelte';
import SettingsDialogShell from 'src/applications/settings/SettingsDialogShell.svelte';
import type {
  SettingsFooterHost,
  SettingsPane,
} from 'src/applications/settings/settings-pane.types';
import { mount } from 'svelte';
import { TidyFlags } from 'src/foundry/TidyFlags';
import {
  buildTabConfigMap,
  getActorTabContext,
  getCanonicalTabSelection,
  getItemTabContext,
} from './tab-configuration-functions';
import { CharacterSheetQuadroneRuntime } from 'src/runtime/actor/CharacterSheetQuadroneRuntime.svelte';
import { NpcSheetQuadroneRuntime } from 'src/runtime/actor/NpcSheetQuadroneRuntime.svelte';
import { VehicleSheetQuadroneRuntime } from 'src/runtime/actor/VehicleSheetQuadroneRuntime.svelte';
import { GroupSheetQuadroneRuntime } from 'src/runtime/actor/GroupSheetQuadroneRuntime.svelte';
import { error } from 'src/utils/logging';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { EncounterSheetQuadroneRuntime } from 'src/runtime/actor/EncounterSheetQuadroneRuntime.svelte';
import type { SheetTabConfiguration } from 'src/settings/settings.types';

export type SheetTabConfigurationContext = {
  entry: TabConfigContextEntry;
};

type GetTabConfigFn = (actor: any) => SheetTabConfiguration | null | undefined;
type SetTabConfigFn = (
  actor: any,
  config: SheetTabConfiguration
) => Promise<void> | undefined;
type GetTabContextFn = (
  doc: any,
  setting: SheetTabConfiguration
) => TabConfigContextEntry | undefined;

export type SheetTabConfigurationQuadroneApplicationConfiguration =
  DocumentSheetApplicationConfiguration & {
    customTabConfigProvider?: {
      getTabConfig: GetTabConfigFn;
      setTabConfig: SetTabConfigFn;
      getTabContext: GetTabContextFn;
    };
    title?: string;
    docTypeKeyOverride?: string;
  };

/**
 * Document-specific tab configuration application.
 * Available tabs: based on the document's runtime registered tab IDs.
 * Selected tabs: document flag data ➡️ else world default setting ➡️ else document runtime default.
 * **Note**: The runtime default is designed to always be available when there are no user-defined settings present.
 */
export class SheetTabConfigurationQuadroneApplication
  extends DocumentSheetDialog<
    SheetTabConfigurationQuadroneApplicationConfiguration,
    SheetTabConfigurationContext
  >()
  implements SettingsPane, SettingsFooterHost
{
  _config: SheetTabConfigurationContext = $state({
    entry: {
      allTabs: {},
      defaultTabs: [],
      documentName: '',
      documentType: '',
      tabs: [],
      title: '',
      visibilityLevels: [],
    },
  });

  _initialSnapshot = $state('');

  hasChanges = $derived(
    this._snapshotEntry($state.snapshot(this._config.entry)) !==
      this._initialSnapshot
  );

  // Standalone window is its own single-pane host.
  canUndo = $derived(this.hasChanges);
  canUseDefault = true;
  _getTabConfig: GetTabConfigFn;
  _setTabConfig: SetTabConfigFn;
  _getTabContext: GetTabContextFn;
  _inclusionTabTitle: string;

  /** TODO: document */
  _docTypeKeyOverride?: string;

  constructor(options: SheetTabConfigurationQuadroneApplicationConfiguration) {
    super(options);

    this._getTabConfig =
      options.customTabConfigProvider?.getTabConfig ??
      TidyFlags.tabConfiguration.get;

    this._setTabConfig =
      options.customTabConfigProvider?.setTabConfig ??
      TidyFlags.tabConfiguration.set;

    this._getTabContext =
      options.customTabConfigProvider?.getTabContext ??
      this._getConfigFromRuntime;

    this._inclusionTabTitle =
      options.title ??
      FoundryAdapter.localize('TIDY5E.TabConfiguration.Title', {
        documentName: FoundryAdapter.localize(
          `TYPES.${options.document.documentName}.${options.document.type}`
        ),
      });

    this._docTypeKeyOverride = options.docTypeKeyOverride;
  }

  static DEFAULT_OPTIONS: Partial<DocumentSheetConfiguration> = {
    classes: [
      CONSTANTS.MODULE_ID,
      'sheet',
      'quadrone',
      'sheet-tab-configuration',
    ],
    tag: 'form',
    sheetConfig: false,
    window: {
      frame: true,
      positioned: true,
      resizable: true,
      controls: [],
      title: 'TIDY5E.SettingsMenu.TabConfiguration.label',
      contentClasses: ['flexcol'],
    },
    position: {
      width: 600,
      height: 600,
    },
    actions: {},
    submitOnClose: false,
  };

  _createComponent(node: HTMLElement): Record<string, any> {
    this._config = {
      entry: this._getConfig(),
    };
    this._resetToGlobalDefaults();

    const component = mount(SettingsDialogShell, {
      target: node,
      props: {
        host: this,
        pane: SheetTabConfigurationQuadrone,
        paneProps: {
          app: this,
          config: this._config,
          title: this._inclusionTabTitle,
        },
      },
    });

    return component;
  }

  _getConfig() {
    let setting = this._getTabConfig(this.document);
    setting ??= { selected: [], visibilityLevels: {} };
    setting.selected ??= [];
    setting.visibilityLevels ??= {};

    if (!setting.selected.length) {
      setting.selected = this._worldDefaultTabIds ?? [];
    }

    const context = this._getTabContext(this.document, setting);

    if (!context) {
      error(
        `An error occurred while loading tab configuration for this sheet. The sheet type is not supported. Document Name: ${this.document.documentName} | Document Type: ${this.document.type}`
      );
      throw new Error(
        `Tab Configuration: Sheet type ${this.document.type} not supported`
      );
    }

    return context;
  }

  _getConfigFromRuntime(doc: any, setting: SheetTabConfiguration) {
    if (doc.documentName === CONSTANTS.DOCUMENT_NAME_ACTOR) {
      const runtime = getActorRuntime(doc.type);
      if (runtime) {
        return getActorTabContext(
          runtime,
          doc.type,
          setting,
          true,
          this._docTypeKeyOverride
        );
      }
    }

    if (doc.documentName === CONSTANTS.DOCUMENT_NAME_ITEM) {
      return getItemTabContext(doc.type, setting, true);
    }
  }

  async save() {
    await this.apply();
    await this.close();
  }

  async apply() {
    let curr = this._config.entry;

    let selectedIds = curr.tabs.filter((t) => t.show).map((t) => t.id);

    // When the current congfiguration exactly matches the default,
    // empty out the settings so that we use defaults.
    let matchesDefault =
      curr.tabs.length === curr.defaultTabs.length &&
      curr.tabs.every((t, i) => {
        const d = curr.defaultTabs[i];
        return d && d.id === t.id && d.show === t.show;
      });

    const result = await this._setTabConfig(this.document, {
      // Legacy fields kept in sync for the sheet runtimes (visible tabs, in order).
      // TODO: Migrate off legacy selected/unselected arrays.
      selected: matchesDefault ? [] : selectedIds,
      visibilityLevels: this._config.entry.visibilityLevels.reduce(
        (prev, curr) => {
          prev[curr.id] = curr.visibilityLevel;
          return prev;
        },
        {} as Record<string, number | null>
      ),
      // Full per-tab arrangement (preserves hidden-tab order).
      tabs: matchesDefault
        ? {}
        : buildTabConfigMap(curr.tabs, curr.visibilityLevels),
    });

    this._resetToGlobalDefaults();

    return result;
  }

  /** Get the initial configuration snapshot for {@link apply} through {@link _resetToGlobalDefaults}.*/
  _snapshotEntry(entry: TabConfigContextEntry): string {
    return JSON.stringify(getCanonicalTabSelection(entry));
  }

  /** Reset the initial snapshot to the global defaults. */
  _resetToGlobalDefaults() {
    this._initialSnapshot = this._snapshotEntry(
      $state.snapshot(this._config.entry)
    );
  }

  undoChanges() {
    // Reassign the nested entry (not _config) so the host keeps its stable
    // _config reference; the list rebuilds via {#key config.entry}.
    this._config.entry = this._getConfig();
    this._resetToGlobalDefaults();
  }

  async useDefault() {
    const proceed = await foundry.applications.api.DialogV2.confirm({
      window: {
        title: FoundryAdapter.localize('TIDY5E.UseDefaultDialog.title'),
      },
      content: `<p>${FoundryAdapter.localize(
        'TIDY5E.UseDefaultDialog.text'
      )}</p>`,
    });

    if (!proceed) {
      return;
    }

    this.resetToDefault();
  }

  /**
   * Stage the global/system default selection (ignoring the saved override).
   * Persisted on the dialog's Save, reversible via Undo.
   */
  resetToDefault() {
    const defaultEntry = this._getTabContext(this.document, {
      selected: [],
      visibilityLevels: {},
    });

    if (defaultEntry) {
      this._config.entry = defaultEntry;
    }
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
