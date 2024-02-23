import { CONSTANTS } from 'src/constants';
import type { SortMode } from 'src/types/types';
import { writable, type Readable, type Writable } from 'svelte/store';


type SheetTypeTabPreferences = {
  sort?: SortMode;
};

type SheetPreference = {
  tabs?: {
    [tabId: string]: SheetTypeTabPreferences;
  };
  width?: number;
  height?: number;
};

type SheetPreferences = {
  [sheetType: string]: SheetPreference;
};
/*
  flags: {
    tidy5e-sheet: {
      sheetPreferences: { 
        character: {
          tabs: {
            inventory: {
              sort: 'm'
            },
            // etc.
          },
          width: 900,
          height: 1000
        },
        npc: {
          tabs: {
            spellbook: {
              sort: 'a'
            }
          },
          width: 1080
        },
      };
    }
  };
};
*/

export class SheetPreferencesService {
  // TODO: Determine if we even need this.
  // Most likely, we'll set a field and then simply call render after setting it,
  // especially with commands. And in other cases, we will NOT want to re-render,
  // such as when changing width/height.
  private static _store: Writable<SheetPreferences> = writable({
    sheetPreferences: {},
  });

  static get store(): Readable<SheetPreferences> {
    return SheetPreferencesService._store;
  }

  /**
   * Establishes tracking of user preference changes and the publishing of the user preferences store.
   */
  static init() {
    Hooks.on('updateUser', () => {
      const preferences = SheetPreferencesService.get();
      if (preferences) {
        SheetPreferencesService._store.set(preferences);
      }
    });
  }

  static async setActorTypeTabPreference<
    K extends keyof SheetTypeTabPreferences,
    V extends SheetTypeTabPreferences[K]
  >(documentType: string, tabId: string, property: K, value: V) {
    await game.user.setFlag(
      CONSTANTS.MODULE_ID,
      `sheetPreferences.${documentType}.tabs.${tabId}.${property}`,
      value
    );
  }

  static async setActorTypePreference<
    K extends keyof SheetPreference,
    V extends SheetPreference[K]
  >(documentType: string, property: K, value: V) {
    await game.user.setFlag(
      CONSTANTS.MODULE_ID,
      `sheetPreferences.${documentType}.${property}`,
      value
    );
  }

  static get(): SheetPreferences {
    return (
      foundry.utils.getProperty(
        game.user,
        `flags.${CONSTANTS.MODULE_ID}.sheetPreferences`
      ) ?? {}
    );
  }

  static getByType(documentType: string): SheetPreference {
    return (
      foundry.utils.getProperty(
        game.user,
        `flags.${CONSTANTS.MODULE_ID}.sheetPreferences.${documentType}`
      ) ?? {}
    );
  }
}
