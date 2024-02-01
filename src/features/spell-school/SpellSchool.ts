export class SpellSchool {
  protected static _iconsMap: Record<string, string> = {
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

  static getIcon(schoolKey: string) {
    return SpellSchool._iconsMap[schoolKey] ?? SpellSchool.fallbackIcon;
  }

  static setIcon(schoolKey: string, iconClass: string) {
    SpellSchool._iconsMap[schoolKey] = iconClass;
  }
}
