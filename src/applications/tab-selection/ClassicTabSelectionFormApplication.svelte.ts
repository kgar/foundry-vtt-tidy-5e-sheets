import { mount } from 'svelte';
import TabSelection from './TabSelection.svelte';
import type { Actor5e } from 'src/types/types';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { error } from 'src/utils/logging';
import type { RegisteredTab } from 'src/runtime/types';
import { CONSTANTS } from 'src/constants';
import { settings } from 'src/settings/settings.svelte';
import CharacterSheetClassicRuntime from 'src/runtime/actor/CharacterSheetClassicRuntime.svelte';
import EncounterSheetClassicRuntime from 'src/runtime/actor/EncounterSheetClassicRuntime.svelte';
import { TabManager } from 'src/runtime/tab/TabManager';
import { TidyFlags } from 'src/foundry/TidyFlags';
import NpcSheetClassicRuntime from 'src/runtime/actor/NpcSheetClassicRuntime.svelte';
import VehicleSheetClassicRuntime from 'src/runtime/actor/VehicleSheetClassicRuntime.svelte';
import GroupSheetClassicRuntime from 'src/runtime/actor/GroupSheetClassicRuntime.svelte';
import type { ApplicationConfiguration } from 'src/types/application.types';
import { SvelteApplicationMixin } from 'src/mixins/SvelteApplicationMixin.svelte';
import { applyThemeToApplication } from 'src/utils/applications.svelte';

export type TabSelectionItem = {
  id: string;
  label: string;
};

export type TabSelectionContext = {
  available: TabSelectionItem[];
  selected: TabSelectionItem[];
};

export default class ClassicTabSelectionFormApplication extends SvelteApplicationMixin<
  Partial<ApplicationConfiguration> | undefined,
  TabSelectionContext
>(foundry.applications.api.ApplicationV2) {
  actor: Actor5e;
  registeredTabs: RegisteredTab<any>[];
  context = $state<TabSelectionContext>({ available: [], selected: [] });

  static DEFAULT_OPTIONS = {
    classes: [
      CONSTANTS.MODULE_ID,
      'application-shell',
      'tab-selection',
      CONSTANTS.SHEET_LAYOUT_CLASSIC,
    ],
    tag: 'div',
    window: {
      frame: true,
      positioned: true,
      resizable: true,
      controls: [],
    },
    position: {
      height: 550,
      width: 750,
    },
    actions: {},
  };

  constructor(actor: Actor5e, args?: ApplicationConfiguration) {
    super(args);
    this.actor = actor;
    this.registeredTabs = this.getRegisteredTabs(actor);
  }

  get title() {
    return FoundryAdapter.localize('TIDY5E.TabSelection.Title', {
      documentName: this.actor.name,
    });
  }

  getRegisteredTabs(actor: Actor5e): RegisteredTab<any>[] {
    if (actor.type === CONSTANTS.SHEET_TYPE_CHARACTER) {
      return CharacterSheetClassicRuntime.getAllRegisteredTabs();
    } else if (actor.type === CONSTANTS.SHEET_TYPE_NPC) {
      return NpcSheetClassicRuntime.getAllRegisteredTabs();
    } else if (actor.type === CONSTANTS.SHEET_TYPE_VEHICLE) {
      return VehicleSheetClassicRuntime.getAllRegisteredTabs();
    } else if (actor.type === CONSTANTS.SHEET_TYPE_GROUP) {
      return GroupSheetClassicRuntime.getAllRegisteredTabs();
    } else if (actor.type === CONSTANTS.SHEET_TYPE_ENCOUNTER) {
      return EncounterSheetClassicRuntime.getAllRegisteredTabs();
    }

    error(
      FoundryAdapter.localize(
        'TIDY5E.TabSelection.UnsupportedDocumentErrorMessage',
        { documentType: this.actor.type }
      )
    );
    return [];
  }

  getDefaultTabIds(actor: Actor5e): string[] {
    if (actor.type === CONSTANTS.SHEET_TYPE_CHARACTER) {
      return settings.value.defaultCharacterSheetTabs;
    } else if (actor.type === CONSTANTS.SHEET_TYPE_NPC) {
      return settings.value.defaultNpcSheetTabs;
    } else if (actor.type === CONSTANTS.SHEET_TYPE_VEHICLE) {
      return settings.value.defaultVehicleSheetTabs;
    } else if (actor.type === CONSTANTS.SHEET_TYPE_GROUP) {
      return settings.value.defaultGroupSheetTabs;
    } else if (actor.type === CONSTANTS.SHEET_TYPE_ENCOUNTER) {
      return settings.value.defaultGroupSheetTabs;
    }

    error(
      FoundryAdapter.localize(
        'TIDY5E.TabSelection.UnsupportedDocumentErrorMessage',
        { documentType: this.actor.type }
      )
    );
    return [];
  }

  _createComponent(node: HTMLElement): Record<string, any> {
    if (this._context.data) {
      this.context = this._context.data;
    }

    return mount(TabSelection, {
      target: node,
      context: new Map<any, any>([
        ['context', this.context],
        ['appId', this.appId],
        ['save', this.save.bind(this)],
        ['apply', this.apply.bind(this)],
        ['useDefault', this.useDefault.bind(this)],
        ['validate', this.validate.bind(this)],
      ]),
    });
  }

  async _prepareContext() {
    const selectedTabIds =
      TidyFlags.selectedTabs.get(this.actor) ??
      this.getDefaultTabIds(this.actor);

    let availableTabs: TabSelectionItem[] = this.registeredTabs
      .filter((t) => !selectedTabIds.includes(t.id))
      .map((t) => ({
        id: t.id,
        label: FoundryAdapter.localize(TabManager.getTabTitle(t)),
      }));

    let selectedTabs: TabSelectionItem[] = this.registeredTabs
      .filter((t) => selectedTabIds.includes(t.id))
      .map((t) => ({
        id: t.id,
        label: FoundryAdapter.localize(TabManager.getTabTitle(t)),
      }))
      .sort(
        (a, b) => selectedTabIds.indexOf(a.id) - selectedTabIds.indexOf(b.id)
      );

    return {
      available: availableTabs,
      selected: selectedTabs,
    } satisfies TabSelectionContext;
  }

  async useDefault() {
    await TidyFlags.selectedTabs.unset(this.actor);
    this.close();
  }

  validate(context: TabSelectionContext) {
    if (context.selected.length === 0) {
      error(
        FoundryAdapter.localize(
          'TIDY5E.TabSelection.AtLeastOneRequiredErrorMessage'
        ),
        true
      );
      return false;
    }

    return true;
  }

  async save(context: TabSelectionContext) {
    await this.apply(context);
    await this.close();
  }

  async apply(context: TabSelectionContext) {
    await TidyFlags.selectedTabs.set(
      this.actor,
      context.selected.map((t) => t.id)
    );
  }

  // Not going to refactor this because this application is living on borrowed time
  _attachFrameListeners() {
    super._attachFrameListeners();

    applyThemeToApplication(this.element, this.actor);
  }
}
