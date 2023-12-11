import type { ExhaustionConfig } from 'src/features/exhaustion/exhaustion.types';
import type { RegisteredActorTab } from 'src/runtime/types';
import type { CurrentSettings } from 'src/settings/settings';
import type { Writable } from 'svelte/store';

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
  exhaustionConfig: ExhaustionConfig;
  vehicleExhaustionConfig: ExhaustionConfig;
};

export type SettingsSheetFunctions = {
  save(settings: SettingsSheetContext): Promise<unknown>;
  apply(settings: SettingsSheetContext): Promise<unknown>;
  mapTabSelectionFields(
    registeredTabs: RegisteredActorTab<any>[],
    selectedTabIds: string[]
  ): DefaultTabSelectionFields;
  validate(context: SettingsSheetContext): boolean;
  resetDefaultTabs(
    context$: Writable<SettingsSheetContext>,
    actorType: string
  ): void;
};

export type SettingsSheetStore = Writable<SettingsSheetContext>;
