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
  /**
   * Gets the combatant settings with the identifer's hyphens
   * @param encounter
   * @returns
   */
  static get(encounter: Actor5e): EncounterCombatantsSettings {
    const settingsWithHyphenatedIdentifiers =
      TidyFlags.combatantSettings.get(encounter);

    const settings: EncounterCombatantsSettings = {};
    for (const key of Object.keys(settingsWithHyphenatedIdentifiers)) {
      const originalId = CombatantSettings._revertIdentifier(key);
      settings[originalId] = {
        ...settingsWithHyphenatedIdentifiers[key],
        identifier: originalId,
      };
    }

    return settings;
  }

  static getEntry(
    encounter: Actor5e,
    identifier: string
  ): EncounterCombatantSettings {
    const entry = CombatantSettings.get(encounter)[identifier] ?? {
      ...CombatantSettings.defaultSettings,
    };

    entry.identifier = CombatantSettings._revertIdentifier(entry.identifier);

    return entry;
  }

  private static _revertIdentifier(identifier: string): string {
    return identifier.replaceAll('-', '.');
  }

  private static _prepareIdentifier(identifier: string): string {
    return identifier.replaceAll('.', '-');
  }

  static async insertOrUpdate(
    encounter: Actor5e,
    data: Partial<EncounterCombatantSettings>
  ): Promise<void> {
    const settings = TidyFlags.combatantSettings.get(encounter);

    CombatantSettings._prepareInsertOrUpdate(settings, data);

    CombatantSettings._trimUnusedSettings(encounter, settings);

    return await TidyFlags.combatantSettings.set(encounter, settings);
  }

  static _prepareInsertOrUpdate(
    settings: EncounterCombatantsSettings,
    data: Partial<EncounterCombatantSettings>
  ) {
    if (isNil(data.identifier)) {
      return;
    }

    data.identifier = CombatantSettings._prepareIdentifier(data.identifier);

    const toSave = FoundryAdapter.mergeObject(
      settings[data.identifier] ?? { ...CombatantSettings.defaultSettings },
      data
    );

    settings[toSave.identifier] = toSave;
  }

  static async bulkInsertOrUpdate(
    encounter: Actor5e,
    data: Record<string, Partial<EncounterCombatantSettings>>
  ) {
    const settings = TidyFlags.combatantSettings.get(encounter);

    for (const entry of Object.values(data)) {
      CombatantSettings._prepareInsertOrUpdate(settings, entry);
    }

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

  static defaultSettings: Readonly<EncounterCombatantSettings> = Object.freeze({
    identifier: '',
    include: true,
    initiative: undefined,
    visible: true,
  });
}
