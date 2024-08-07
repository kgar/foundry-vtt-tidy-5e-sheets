import type { SvelteComponent } from 'svelte';
import SvelteFormApplicationBase from '../SvelteFormApplicationBase';
import TabSelection from './TabSelection.svelte';
import type { Actor5e } from 'src/types/types';
import { get, writable } from 'svelte/store';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { error } from 'src/utils/logging';
import type { RegisteredTab } from 'src/runtime/types';
import { CONSTANTS } from 'src/constants';
import { SettingsProvider } from 'src/settings/settings';
import { NpcSheetRuntime } from 'src/runtime/NpcSheetRuntime';
import { CharacterSheetRuntime } from 'src/runtime/CharacterSheetRuntime';
import { VehicleSheetRuntime } from 'src/runtime/VehicleSheetRuntime';
import { TabManager } from 'src/runtime/tab/TabManager';
import { TidyFlags } from 'src/foundry/TidyFlags';

export type TabSelectionItem = {
  id: string;
  label: string;
};

export type TabSelectionContext = {
  available: TabSelectionItem[];
  selected: TabSelectionItem[];
};

export default class TabSelectionFormApplication extends SvelteFormApplicationBase {
  actor: Actor5e;
  context = writable<TabSelectionContext>({ available: [], selected: [] });
  registeredTabs: RegisteredTab<any>[];

  constructor(actor: Actor5e, ...args: any[]) {
    super(...args);
    this.actor = actor;
    this.registeredTabs = this.getRegisteredTabs(actor);
  }

  getRegisteredTabs(actor: Actor5e): RegisteredTab<any>[] {
    if (actor.type === CONSTANTS.SHEET_TYPE_CHARACTER) {
      return CharacterSheetRuntime.getAllRegisteredTabs();
    } else if (actor.type === CONSTANTS.SHEET_TYPE_NPC) {
      return NpcSheetRuntime.getAllRegisteredTabs();
    } else if (actor.type === CONSTANTS.SHEET_TYPE_VEHICLE) {
      return VehicleSheetRuntime.getAllRegisteredTabs();
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
      return SettingsProvider.settings.defaultCharacterSheetTabs.get();
    } else if (actor.type === CONSTANTS.SHEET_TYPE_NPC) {
      return SettingsProvider.settings.defaultNpcSheetTabs.get();
    } else if (actor.type === CONSTANTS.SHEET_TYPE_VEHICLE) {
      return SettingsProvider.settings.defaultVehicleSheetTabs.get();
    }

    error(
      FoundryAdapter.localize(
        'TIDY5E.TabSelection.UnsupportedDocumentErrorMessage',
        { documentType: this.actor.type }
      )
    );
    return [];
  }

  createComponent(node: HTMLElement): SvelteComponent<any, any, any> {
    return new TabSelection({
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
      classes: [...super.defaultOptions.classes, 'tab-selection'],
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
    const context = get(this.context);
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

  async save() {
    const context = get(this.context);

    await TidyFlags.selectedTabs.set(
      this.actor,
      context.selected.map((t) => t.id)
    );
  }

  async _updateObject(): Promise<void> {
    await this.save();
  }

  refreshContext() {
    this.context.set(this.getData());
  }

  async apply() {
    await this.save();
  }
}
