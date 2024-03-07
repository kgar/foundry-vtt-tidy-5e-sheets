import { SpellSchool } from 'src/features/spell-school/SpellSchool';
import type { SupportedSpellSchoolIcon } from './spell-school.types';

/**
 * Allows for configuration related to Spell Schools.
 * Currently, [FontAwesome](https://fontawesome.com/) and [RPG Awesome](https://nagoshiashumari.github.io/Rpg-Awesome/) icons are officially supported.
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
  setIcon(schoolKey: string, iconClass: SupportedSpellSchoolIcon) {
    SpellSchool.setIcon(schoolKey, iconClass);
  }
}
