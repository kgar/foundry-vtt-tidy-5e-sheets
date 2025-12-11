import type { CurrentSettings } from 'src/settings/settings.svelte';

export type UserSettingsContext = {
  settings: {
    actionListIncludeConsumables: CurrentSettings['actionListIncludeConsumables'];
    actionListIncludeMinuteLongSpellsAsActions: CurrentSettings['actionListIncludeMinuteLongSpellsAsActions'];
    actionListIncludeSpellsWithActiveEffects: CurrentSettings['actionListIncludeSpellsWithActiveEffects'];
    actionListLimitActionsToCantrips: CurrentSettings['actionListLimitActionsToCantrips'];
    inlineActivitiesPosition: CurrentSettings['inlineActivitiesPosition'];
  };
};

export type UserSettingsFunctions = {
  save(settings: UserSettingsContext): Promise<unknown>;
  apply(settings: UserSettingsContext): Promise<unknown>;
  validate(context: UserSettingsContext): boolean;
};
