import {
  TidyFlags,
  type EncounterCombatantSettings,
  type EncounterCombatantsSettings,
} from 'src/api';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { Actor5e } from 'src/types/types';
import { isNil } from 'src/utils/data';

/**
 * An adapter for managing the `combatantSettings` document flag.
 */
export class CombatantSettings {
  static get(encounter: Actor5e): EncounterCombatantsSettings {
    return TidyFlags.combatantSettings.get(encounter);
  }

  static getEntry(
    encounter: Actor5e,
    identifier: string
  ): EncounterCombatantSettings | undefined {
    identifier = CombatantSettings._prepareIdentifier(identifier);

    return (
      CombatantSettings.get(encounter)[identifier] ?? {
        ...CombatantSettings.defaultSettings,
      }
    );
  }

  private static _prepareIdentifier(identifier: string): string {
    return identifier.replaceAll('.', '-');
  }

  static async insertOrUpdate(
    encounter: Actor5e,
    data: Partial<EncounterCombatantSettings>
  ): Promise<void> {
    if (isNil(data.identifier)) {
      return;
    }

    data.identifier = CombatantSettings._prepareIdentifier(data.identifier);

    const settings = CombatantSettings.get(encounter);

    const toSave = FoundryAdapter.mergeObject(
      settings[data.identifier] ?? { ...CombatantSettings.defaultSettings },
      data
    );

    settings[toSave.identifier] = toSave;

    CombatantSettings._trimUnusedSettings(encounter, settings);

    return await TidyFlags.combatantSettings.set(encounter, settings);
  }

  /**
   * Removes settings that don't correspond to a member or a placeholder.
   * Assumes identifiers have already been prepared for saving.
   */
  static _trimUnusedSettings(
    encounter: Actor5e,
    settings: EncounterCombatantsSettings
  ) {
    const identifiers = new Set<string>(
      encounter.system.members
        .map((m: any) => CombatantSettings._prepareIdentifier(m.uuid))
        .concat(Object.keys(TidyFlags.placeholders.get(encounter)))
    );

    for (const key of Object.keys(settings)) {
      if (!identifiers.has(key)) {
        delete settings[key];
      }
    }
  }

  static defaultSettings: EncounterCombatantSettings = {
    identifier: '',
    include: true,
    initiative: undefined,
    visible: true,
  };
}
