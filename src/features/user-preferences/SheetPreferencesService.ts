import { CONSTANTS } from 'src/constants';
import type {
  UserSheetPreferences,
  UserSheetTypeTabPreferences,
  UserSheetPreference,
} from './user-preferences.types';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';

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
export class UserSheetPreferencesService {
  static readonly prop = `flags.${CONSTANTS.MODULE_ID}.sheetPreferences`;

  static getTabProp<K extends keyof UserSheetTypeTabPreferences>(
    documentType: string,
    tabId: string,
    property: K,
    includeFullPrefix?: boolean
  ) {
    const prefix = includeFullPrefix ? `flags.${CONSTANTS.MODULE_ID}.` : '';
    return `${prefix}sheetPreferences.${documentType}.tabs.${tabId}.${property}`;
  }

  static async setDocumentTypeTabPreference<
    K extends keyof UserSheetTypeTabPreferences,
    V extends UserSheetTypeTabPreferences[K]
  >(documentType: string, tabId: string, property: K, value: V) {
    await game.user.setFlag(
      CONSTANTS.MODULE_ID,
      UserSheetPreferencesService.getTabProp(documentType, tabId, property),
      value
    );
  }

  static getDocumentTypeTabPreference<
    K extends keyof UserSheetTypeTabPreferences,
    V extends UserSheetTypeTabPreferences[K]
  >(documentType: string, tabId: string, property: K): V | undefined {
    return FoundryAdapter.getProperty(
      game.user,
      UserSheetPreferencesService.getTabProp(
        documentType,
        tabId,
        property,
        true
      )
    );
  }

  static async setDocumentTypePreference<
    K extends keyof UserSheetPreference,
    V extends UserSheetPreference[K]
  >(documentType: string, property: K, value: V) {
    await game.user.setFlag(
      CONSTANTS.MODULE_ID,
      `sheetPreferences.${documentType}.${property}`,
      value
    );
  }

  static get(): UserSheetPreferences {
    return (
      foundry.utils.getProperty(game.user, UserSheetPreferencesService.prop) ??
      {}
    );
  }

  static getByType(documentType: string): UserSheetPreference {
    return (
      foundry.utils.getProperty(
        game.user,
        `${UserSheetPreferencesService.prop}.${documentType}`
      ) ?? {}
    );
  }
}
