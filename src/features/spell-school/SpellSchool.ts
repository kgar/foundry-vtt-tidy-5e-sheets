export class SpellSchool {
  static iconsMap: Record<string, string> = {
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

  static getSchoolIcon(schoolKey: string) {
    return SpellSchool.iconsMap[schoolKey] ?? SpellSchool.fallbackIcon;
  }
}
