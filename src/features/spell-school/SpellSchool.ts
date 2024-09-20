import type { SupportedSpellSchoolIcon } from 'src/api/config/spell-school/spell-school.types';
import { SettingsProvider } from 'src/settings/settings';

export class SpellSchool {
  protected static _iconsMap: Record<string, SupportedSpellSchoolIcon> = {
    abj: 'ra ra-shield',
    con: 'ra ra-tentacle',
    div: 'ra ra-crystal-ball',
    enc: 'ra ra-aware',
    evo: 'ra ra-burning-meteor',
    ill: 'ra ra-bleeding-eye',
    nec: 'ra ra-skull',
    trs: 'ra ra-cycle',
  };

  static fallbackIcon = 'fas fa-hat-wizard';

  static getIcon(schoolKey: string): SupportedSpellSchoolIcon {
    if (SettingsProvider.settings.useTidySpellSchoolIcons.get()) {
      return SpellSchool._iconsMap[schoolKey] ?? SpellSchool.fallbackIcon;
    }

    const dnd5eConfigIcon =
      CONFIG.DND5E.spellSchools[
        schoolKey as keyof typeof CONFIG.DND5E.spellSchools
      ]?.icon;

    if (dnd5eConfigIcon) {
      return {
        iconSrc: dnd5eConfigIcon,
      };
    }

    return SpellSchool.fallbackIcon;
  }

  static setIcon(schoolKey: string, iconClass: SupportedSpellSchoolIcon) {
    SpellSchool._iconsMap[schoolKey] = iconClass;
  }
}
