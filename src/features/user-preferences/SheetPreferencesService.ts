import { CONSTANTS } from 'src/constants';
import type {
  SheetPreferences,
  SheetTypeTabPreferences,
  SheetPreference,
} from './user-preferences.types';

/**
 * A service for managing sheet preferences that are cached on the user document under this module's flags.
 *
 * @example What the data looks like
 * ```json
 * {
 *   "flags": {
 *     "tidy5e-sheet": {
 *       "sheetPreferences": {
 *         "character": {
 *           "tabs": {
 *             "inventory": {
 *               "sort": "m"
 *             }
 *           },
 *           "width": 900,
 *           "height": 1000
 *         },
 *         "npc": {
 *           "tabs": {
 *             "spellbook": {
 *               "sort": "a"
 *             }
 *           },
 *           "width": 1080
 *         }
 *       }
 *     }
 *   }
 * }
 * ```
 */
export class SheetPreferencesService {

  static async setDocumentTypeTabPreference<
    K extends keyof SheetTypeTabPreferences,
    V extends SheetTypeTabPreferences[K]
  >(documentType: string, tabId: string, property: K, value: V) {
    await game.user.setFlag(
      CONSTANTS.MODULE_ID,
      `sheetPreferences.${documentType}.tabs.${tabId}.${property}`,
      value
    );
  }

  static async setDocumentTypePreference<
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
