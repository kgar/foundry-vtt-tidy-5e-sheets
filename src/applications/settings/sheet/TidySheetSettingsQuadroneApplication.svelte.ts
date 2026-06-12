import { DocumentSheetDialog } from 'src/applications-quadrone/DocumentSheetDialog.svelte';
import type {
  ApplicationClosingOptions,
  ApplicationRenderOptions,
  DocumentSheetApplicationConfiguration,
  DocumentSheetConfiguration,
} from 'src/types/application.types';
import { CONSTANTS } from 'src/constants';
import { TidySheetSettingsTabIds } from './sheet-settings-ids';
export { TidySheetSettingsTabIds };
import { mount } from 'svelte';
import { TidyFlags } from 'src/foundry/TidyFlags';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { ActorSheetQuadroneRuntime } from 'src/runtime/ActorSheetQuadroneRuntime.svelte';
import { CharacterSheetQuadroneRuntime } from 'src/runtime/actor/CharacterSheetQuadroneRuntime.svelte';
import { NpcSheetQuadroneRuntime } from 'src/runtime/actor/NpcSheetQuadroneRuntime.svelte';
import { VehicleSheetQuadroneRuntime } from 'src/runtime/actor/VehicleSheetQuadroneRuntime.svelte';
import { GroupSheetQuadroneRuntime } from 'src/runtime/actor/GroupSheetQuadroneRuntime.svelte';
import { EncounterSheetQuadroneRuntime } from 'src/runtime/actor/EncounterSheetQuadroneRuntime.svelte';
import { CharacterSheetQuadroneSidebarRuntime } from 'src/runtime/actor/CharacterSheetQuadroneSidebarRuntime.svelte';
import { getActorTabContext } from 'src/applications/tab-configuration/tab-configuration-functions';
import { ThemeSettingsQuadroneApplication } from 'src/applications/theme/ThemeSettingsQuadroneApplication.svelte';
import { TidyHooks } from 'src/foundry/TidyHooks';
import { error } from 'src/utils/logging';
import TidySheetSettings from './TidySheetSettings.svelte';
import type { SettingsFooterHost } from 'src/applications/settings/settings-pane.types';
import { ItemSheetQuadroneRuntime } from 'src/runtime/item/ItemSheetQuadroneRuntime.svelte';
import type { RegisteredTab } from 'src/runtime/types';
import {
  getThemeSettingsEditor,
  type ThemeSettingsEditor,
} from '../editors/theme-settings-editor.svelte';
import {
  getWorldHeaderControlConfigurationSettingsEditor,
  type HeaderControlConfigContextItem,
  type WorldHeaderControlConfigurationSettingsEditor,
} from '../editors/world-header-control-configuration-settings-editor.svelte';
import type { SettingsEditor } from '../editors/settings-editors.svelte';
import {
  getSheetTabConfigurationSettingsEditor,
  SIDEBAR_EXPANDABLE_SHEET_TYPES,
  type SheetTabConfigurationSettingsEditor,
} from '../editors/sheet-tab-configuration-settings-editor.svelte';
import {
  getSpecialTraitsSettingsEditor,
  type SpecialTraitsSettingsEditor,
} from '../editors/special-traits-settings-editor.svelte';
import {
  getSpellSourceItemAssignmentsSettingsEditor,
  type SpellSourceItemAssignmentsSettingsEditor,
} from '../editors/spell-source-item-assignments-settings-editor.svelte';
import {
  getConfigureSectionsSettingsEditor,
  type ConfigureSectionsSettingsEditor,
  type SectionOptionGroup,
} from '../editors/configure-sections-settings-editor.svelte';

type SheetSettingsRuntimeAdapter = {
  getAllRegisteredTabs(): RegisteredTab<any>[];
};

export type TidySheetSettingsContext = {};

export type ConfigureSectionsInput = {
  tabId: string;
  sections: import('src/types/types').TidySectionBase[];
  optionsGroups?: SectionOptionGroup[];
  formTitle?: string;
};

export type TidySheetSettingsApplicationConfiguration =
  DocumentSheetApplicationConfiguration & {
    initialTabId?: string;
    tabSettings?: {
      [tabId: string]: ConfigureSectionsInput;
    };
  };

export class TidySheetSettingsQuadroneApplication
  extends DocumentSheetDialog<
    TidySheetSettingsApplicationConfiguration,
    TidySheetSettingsContext
  >()
  implements SettingsFooterHost
{
  _config: TidySheetSettingsContext = $state({});

  initialTabId?: string;
  currentTabId = $state<string | undefined>(undefined);

  tabSettings: Record<string, ConfigureSectionsInput>;

  themeSettingsTab: ThemeSettingsEditor;
  tabDisplaySettingsTab: SheetTabConfigurationSettingsEditor;
  headerControlsTab?: WorldHeaderControlConfigurationSettingsEditor;
  sidebarTabDisplaySettingsTab?: SheetTabConfigurationSettingsEditor;
  specialTraitsChildApp: SpecialTraitsSettingsEditor;
  spellSourceItemAssignmentsChildApp?: SpellSourceItemAssignmentsSettingsEditor;
  configureSectionsChildAppByTabId = new Map<
    string,
    ConfigureSectionsSettingsEditor
  >();

  themePlaceholders?: ReturnType<
    ThemeSettingsQuadroneApplication['_mapSettings']
  >;

  // Check changes across all tabs
  hasChanges = $derived.by(() => {
    // Make sure to get the current tab if loaded by default
    this.currentTabId;
    return (
      !!this.themeSettingsTab.hasChanges ||
      !!this.tabDisplaySettingsTab.hasChanges ||
      !!this.headerControlsTab?.hasChanges ||
      !!this.sidebarTabDisplaySettingsTab?.hasChanges ||
      !!this.specialTraitsChildApp.hasChanges ||
      !!this.spellSourceItemAssignmentsChildApp?.hasChanges ||
      [...this.configureSectionsChildAppByTabId.values()].some(
        (app) => app.hasChanges,
      )
    );
  });

  // For storing save/cancel state
  _persisted = false;

  static sheetTabId(tabId: string): string {
    return `sheet:${tabId}`;
  }

  static settingsSheetTabId(
    documentName: string,
    documentType: string,
  ): string {
    return `settings:sheet:${documentName}:${documentType}`;
  }

  static DEFAULT_OPTIONS: Partial<DocumentSheetConfiguration> = {
    classes: [CONSTANTS.MODULE_ID, 'sheet', 'quadrone', 'tidy-sheet-settings'],
    id: 'tidy-sheet-settings-{id}',
    tag: 'div',
    sheetConfig: false,
    window: {
      frame: true,
      positioned: true,
      resizable: true,
      controls: [],
      title: 'TIDY5E.SheetSettings.title',
      contentClasses: ['flexcol'],
    },
    position: {
      width: 750,
      height: 600,
    },
    actions: {},
    submitOnClose: false,
  };

  constructor(options: TidySheetSettingsApplicationConfiguration) {
    super(options);

    const initial = options.initialTabId;
    if (initial?.startsWith('settings:') || initial?.startsWith('sheet:')) {
      this.initialTabId = initial;
    } else if (initial) {
      this.initialTabId = `sheet:${initial}`;
    }
    this.currentTabId = this.initialTabId;
    this.tabSettings = options.tabSettings ?? {};

    this.themeSettingsTab = getThemeSettingsEditor(this.document);
    this.themeSettingsTab.initialize();

    // Header control placement is world-level, so only GMs can persist changes.
    if (!this.headerControlsTab && FoundryAdapter.userIsGm()) {
      this.headerControlsTab = getWorldHeaderControlConfigurationSettingsEditor(
        {
          documentName: this.document.documentName,
          documentType: this.document.type,
        },
      );
      this.headerControlsTab.initialize();
    }

    this.tabDisplaySettingsTab = getSheetTabConfigurationSettingsEditor({
      document: this.document,
    });
    this.tabDisplaySettingsTab.initialize();

    this.specialTraitsChildApp = getSpecialTraitsSettingsEditor(this.document);
    this.specialTraitsChildApp.initialize();

    if (this.document.type === CONSTANTS.SHEET_TYPE_CHARACTER) {
      this.sidebarTabDisplaySettingsTab =
        getSheetTabConfigurationSettingsEditor({
          document: this.document,
          customTabConfigProvider: {
            getTabConfig: TidyFlags.sidebarTabConfiguration.get,
            setTabConfig: TidyFlags.sidebarTabConfiguration.set,
            getTabContext: (doc, setting) =>
              getActorTabContext(
                CharacterSheetQuadroneSidebarRuntime,
                doc.documentName,
                setting,
                true,
                CONSTANTS.WORLD_TAB_CONFIG_KEY_CHARACTER_SIDEBAR,
              ),
          },
          title: FoundryAdapter.localize('TIDY5E.TabConfiguration.Title', {
            documentName: FoundryAdapter.localize(
              'TIDY5E.SheetSettings.Sidebar.title',
            ),
          }),
          docTypeKeyOverride: CONSTANTS.WORLD_TAB_CONFIG_KEY_CHARACTER_SIDEBAR,
        });
      this.sidebarTabDisplaySettingsTab.initialize();
    }

    if (this.document?.itemTypes?.spell?.length) {
      this.spellSourceItemAssignmentsChildApp =
        getSpellSourceItemAssignmentsSettingsEditor(this.document);
      this.spellSourceItemAssignmentsChildApp.initialize();
    }
  }

  selectTab(id: string) {
    this.currentTabId = id;
  }

  /**
   * The pane for undo/use global defaults. Undefined for pages that act
   * immediately (spell assignments, special traits).
   */
  getActivePane(): SettingsEditor<unknown> | undefined {
    const currentTabId = this.currentTabId ?? TidySheetSettingsTabIds.theme;
    switch (currentTabId) {
      case TidySheetSettingsTabIds.theme:
        return this.themeSettingsTab;
      case TidySheetSettingsTabIds.specialTraits:
        return this.specialTraitsChildApp;
      case TidySheetSettingsTabIds.spellAssignments:
        return this.spellSourceItemAssignmentsChildApp;
      case TidySheetSettingsTabIds.tabConfig:
        return this.tabDisplaySettingsTab;
      case TidySheetSettingsTabIds.headerControls:
        return this.headerControlsTab;
      case TidySheetSettingsTabIds.sidebarTabConfig:
        return this.sidebarTabDisplaySettingsTab;
      default: {
        if (!currentTabId.startsWith('sheet:')) {
          return undefined;
        }
        const tabId = currentTabId.slice('sheet:'.length);
        // Special traits keeps its own in-pane controls.
        if (tabId === CONSTANTS.TAB_CHARACTER_ATTRIBUTES) {
          return undefined;
        }
        // Fall back to tabDisplaySettingsTab for tabs that only have visibility
        // controls (the placeholder pane) — changes land there either way.
        return (
          this.getConfigureSectionsConfigTab(tabId) ??
          this.tabDisplaySettingsTab
        );
      }
    }
  }

  get canUndo(): boolean {
    return !!this.getActivePane()?.hasChanges;
  }

  get canUseDefault(): boolean {
    return !!this.getActivePane()?.canUseDefault;
  }

  /**
   * Section editors and default sheet settings operate differently and don't
   * have global fallback settings. This lets you set a different label on the
   * reset button.
   */
  get useDefaultLabel(): string | undefined {
    const currentTabId = this.currentTabId ?? TidySheetSettingsTabIds.theme;
    return currentTabId.startsWith('sheet:') ? 'TIDY5E.UseDefault' : undefined;
  }

  undoChanges() {
    this.getActivePane()?.undoChanges();
  }

  async useDefault() {
    const pane = this.getActivePane();
    if (!pane) {
      return;
    }

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

    pane.resetToDefault();
  }

  /**
   * The world header control config entry matching the current document's sheet type.
   */
  get headerControlEntry(): HeaderControlConfigContextItem | undefined {
    return this.headerControlsTab?.value.find(
      (c) =>
        c.documentName === this.document.documentName &&
        c.documentType === this.document.type,
    );
  }

  /**
   * Open the world settings dialog focused on this sheet type's configuration.
   */
  async openWorldHeaderControlSettings() {
    const { WorldSettingsQuadroneApplication } =
      await import('src/applications/settings/world/TidyWorldSettingsQuadroneApplication.svelte');

    new WorldSettingsQuadroneApplication({
      initialTabId: TidySheetSettingsQuadroneApplication.settingsSheetTabId(
        this.document.documentName,
        this.document.type,
      ),
    }).render(true);
  }

  /**
   *  Get tabs for the calling sheet
   */
  _createComponent(node: HTMLElement): Record<string, any> {
    return mount(TidySheetSettings, {
      target: node,
      props: {
        app: this,
      },
    });
  }

  async _prepareContext(
    _options: ApplicationRenderOptions,
  ): Promise<TidySheetSettingsContext> {
    return this._config;
  }

  _buildTabSettingsFromRuntime(
    tabId: string,
  ): ConfigureSectionsInput | undefined {
    const runtime = this._getRuntime();
    if (!runtime) {
      return undefined;
    }
    const tab = runtime.getAllRegisteredTabs().find((t) => t.id === tabId);
    if (!tab?.settingsTabBuilder) {
      return undefined;
    }
    const sheetContext = this.document?.sheet?._context?.data;
    if (!sheetContext) {
      return undefined;
    }
    return tab.settingsTabBuilder(sheetContext, tabId);
  }

  /**
   *  Get the Configure Sections config tab for a given tab ID. This is used within every
   *  tab settings pane for the section configuration.
   */
  getConfigureSectionsConfigTab(
    tabId: string,
  ): ConfigureSectionsSettingsEditor | undefined {
    const cached = this.configureSectionsChildAppByTabId.get(tabId);
    if (cached) {
      return cached;
    }

    const input =
      this.tabSettings[tabId] ?? this._buildTabSettingsFromRuntime(tabId);
    if (!input) {
      return undefined;
    }

    const app = getConfigureSectionsSettingsEditor({
      document: this.document,
      settings: {
        tabId: input.tabId,
        sections: input.sections,
        optionsGroups: input.optionsGroups ?? ([] as SectionOptionGroup[]),
        formTitle: input.formTitle ?? '',
      },
      navigator: this,
      onSave: async () => {
        this.tabDisplaySettingsTab.save();
      },
    });

    app.initialize();

    this.configureSectionsChildAppByTabId.set(tabId, app);

    return app;
  }

  _getRuntime(): SheetSettingsRuntimeAdapter | undefined {
    // Item sheet tabs are handled differently
    if (this.document?.documentName === CONSTANTS.DOCUMENT_NAME_ITEM) {
      const type = this.document.type;
      return {
        getAllRegisteredTabs: () =>
          ItemSheetQuadroneRuntime.getAllRegisteredTabs(type),
      };
    }

    if (this.document?.documentName === CONSTANTS.DOCUMENT_NAME_ACTOR) {
      let runtime: ActorSheetQuadroneRuntime<any> | undefined;
      switch (this.document.type) {
        case CONSTANTS.SHEET_TYPE_CHARACTER:
          runtime = CharacterSheetQuadroneRuntime;
          break;
        case CONSTANTS.SHEET_TYPE_NPC:
          runtime = NpcSheetQuadroneRuntime;
          break;
        case CONSTANTS.SHEET_TYPE_VEHICLE:
          runtime = VehicleSheetQuadroneRuntime;
          break;
        case CONSTANTS.SHEET_TYPE_GROUP:
          runtime = GroupSheetQuadroneRuntime;
          break;
        case CONSTANTS.SHEET_TYPE_ENCOUNTER:
          runtime = EncounterSheetQuadroneRuntime;
          break;
      }
      if (!runtime) {
        return undefined;
      }
      return {
        getAllRegisteredTabs: () => runtime.getAllRegisteredTabs(),
      };
    }

    return undefined;
  }

  /**
   *  Saves settings for each Sheet Setttings tab in the Settings app.
   *  Individual tabs
   */
  async save() {
    try {
      await this.themeSettingsTab?.save();
      await this.tabDisplaySettingsTab?.save();
      await this.headerControlsTab?.save();
      await this.sidebarTabDisplaySettingsTab?.save();
      await this.specialTraitsChildApp.save();
      await this.spellSourceItemAssignmentsChildApp?.save();

      for (const helper of this.configureSectionsChildAppByTabId.values()) {
        await helper.save();
      }
      this._persisted = true;
    } catch (e) {
      error('Failed to save sheet settings', false, e);
      return;
    }

    await this.close();
  }

  async cancel() {
    await this.close();
  }

  async close(options: ApplicationClosingOptions = {}) {
    if (!this._persisted) {
      TidyHooks.tidy5eSheetsThemeSettingsChanged(this.document);
    }

    await super.close(options);
  }
}
