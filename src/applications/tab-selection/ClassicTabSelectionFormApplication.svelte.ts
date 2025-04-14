import { mount } from 'svelte';
import SvelteFormApplicationBase from '../SvelteFormApplicationBase';
import TabSelection from './TabSelection.svelte';
import type { Actor5e } from 'src/types/types';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { error } from 'src/utils/logging';
import type { RegisteredTab } from 'src/runtime/types';
import { CONSTANTS } from 'src/constants';
import { settings } from 'src/settings/settings.svelte';
import CharacterSheetClassicRuntime from 'src/runtime/actor/CharacterSheetClassicRuntime';
import { TabManager } from 'src/runtime/tab/TabManager';
import { TidyFlags } from 'src/foundry/TidyFlags';
import NpcSheetClassicRuntime from 'src/runtime/actor/NpcSheetClassicRuntime';
import VehicleSheetClassicRuntime from 'src/runtime/actor/VehicleSheetClassicRuntime';
import GroupSheetClassicRuntime, {
  defaultGroupClassicTabs,
} from 'src/runtime/actor/GroupSheetClassicRuntime';

export type TabSelectionItem = {
  id: string;
  label: string;
};

export type TabSelectionContext = {
  available: TabSelectionItem[];
  selected: TabSelectionItem[];
};

export default class ClassicTabSelectionFormApplication extends SvelteFormApplicationBase {
  actor: Actor5e;
  context = $state<TabSelectionContext>({ available: [], selected: [] });
  registeredTabs: RegisteredTab<any>[];

  constructor(actor: Actor5e, ...args: any[]) {
    super(...args);
    this.actor = actor;
    this.registeredTabs = this.getRegisteredTabs(actor);
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
      // TODO: Make this configurable.
      return defaultGroupClassicTabs.map((x) => x.id);
    }

    error(
      FoundryAdapter.localize(
        'TIDY5E.TabSelection.UnsupportedDocumentErrorMessage',
        { documentType: this.actor.type }
      )
    );
    return [];
  }

  createComponent(node: HTMLElement): Record<string, any> {
    return mount(TabSelection, {
      target: node,
      context: new Map<any, any>([
        ['context', this.context],
        ['appId', this.appId],
        ['apply', this.apply.bind(this)],
        ['useDefault', this.useDefault.bind(this)],
        ['validate', this.validate.bind(this)],
      ]),
    });
  }

  static get defaultOptions() {
    return {
      ...super.defaultOptions,
      height: 550,
      width: 750,
      classes: [
        ...super.defaultOptions.classes,
        'tab-selection',
        'app-v1',
        CONSTANTS.SHEET_LAYOUT_CLASSIC,
      ],
      resizable: false,
    };
  }

  get title() {
    return FoundryAdapter.localize('TIDY5E.TabSelection.Title', {
      documentName: this.actor.name,
    });
  }

  getData() {
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

  validate() {
    if (this.context.selected.length === 0) {
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

  async save() {
    await this.apply();
    await this.close();
  }

  async _updateObject(): Promise<void> {
    await this.save();
  }

  refreshContext() {
    this.context = this.getData();
  }

  async apply() {
    await TidyFlags.selectedTabs.set(
      this.actor,
      this.context.selected.map((t) => t.id)
    );
  }
}
