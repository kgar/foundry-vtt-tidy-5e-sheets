import { SpellSchool } from "src/features/spell-school/SpellSchool";

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
   */
  static setIcon(schoolKey: string, iconClass: string) {
    SpellSchool.setIcon(schoolKey, iconClass);
  }
}
