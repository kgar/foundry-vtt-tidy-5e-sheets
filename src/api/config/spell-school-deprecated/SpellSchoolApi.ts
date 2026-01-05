import { warn } from 'src/utils/logging';
import type { SupportedSpellSchoolIcon } from './spell-school.types';

/**
 * Allows for configuration related to Spell Schools.
 * Currently, [FontAwesome](https://fontawesome.com/) icons are officially supported.
 *
 * @category Configuration
 */
export class SpellSchoolApi {
  /**
   * Sets an icon class for a target school key.
   * @param schoolKey the key that represents a spell school, e.g. "abj" for Abjuration, "nec" for Necromancy, and "trs" for Transmutation
   * @param iconClass a class string for an `<i>` element
   *
   * @example Changing the transmutation icon to some nice coins.
   * ```js
   * Hooks.once("tidy5e-sheet.ready", (api) => {
   *   api.config.spellSchool.setIcon('trs', 'fa-solid fa-coins');
   * });
   * ```
   */
  setIcon(_schoolKey: string, _iconClass: SupportedSpellSchoolIcon) {
    warn(`The API ${SpellSchoolApi.name} is no longer supported and will be removed in Foundry version 15`, false, undefined, true);
  }
}
