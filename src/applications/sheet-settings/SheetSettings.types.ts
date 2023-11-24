import type { SheetTabState } from "src/runtime/types";
import type { CurrentSettings } from "src/settings/settings";
import type { Writable } from "svelte/store";

export type DefaultTabSelectionItem = {
  id: string;
  label: string;
};

export type DefaultTabSelectionFields = {
  available: DefaultTabSelectionItem[];
  selected: DefaultTabSelectionItem[];
};

export type SettingsSheetContext = {
  settings: CurrentSettings;
  defaultCharacterTabs: DefaultTabSelectionFields;
  defaultNpcTabs: DefaultTabSelectionFields;
  defaultVehicleTabs: DefaultTabSelectionFields;
};

export type SettingsSheetFunctions = {
  save(settings: SettingsSheetContext): Promise<unknown>;
  apply(settings: SettingsSheetContext): Promise<unknown>;
  mapTabSelectionFields(
    registeredTabs: SheetTabState<any>[],
    selectedTabIds: string[]
  ): DefaultTabSelectionFields;
};

export type SettingsSheetStore = Writable<SettingsSheetContext>;
