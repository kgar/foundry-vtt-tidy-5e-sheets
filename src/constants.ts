export const CONSTANTS = {
  MODULE_ID: 'tidy5e-sheet-kgar',
  /**
   * Main button pressed, usually the left button or the un-initialized state
   */
  MOUSE_BUTTON_MAIN: 0,
  /**
   * Auxiliary button pressed, usually the wheel button or the middle button (if present)
   */
  MOUSE_BUTTON_AUXILIARY: 1,
  /**
   * Secondary button pressed, usually the right button
   */
  MOUSE_BUTTON_SECONDARY: 2,
  CONTEXT_MENU_TYPE_EFFECTS: 'effects',
  CONTEXT_MENU_TYPE_ITEMS: 'items',
  DND5E_CLASSES: {
    artificer: 'TIDY5E.ClassArtificer',
    barbarian: 'TIDY5E.ClassBarbarian',
    bard: 'TIDY5E.ClassBard',
    cleric: 'TIDY5E.ClassCleric',
    druid: 'TIDY5E.ClassDruid',
    fighter: 'TIDY5E.ClassFighter',
    monk: 'TIDY5E.ClassMonk',
    paladin: 'TIDY5E.ClassPaladin',
    ranger: 'TIDY5E.ClassRanger',
    rogue: 'TIDY5E.ClassRogue',
    sorcerer: 'TIDY5E.ClassSorcerer',
    warlock: 'TIDY5E.ClassWarlock',
    wizard: 'TIDY5E.ClassWizard',
    custom: 'TIDY5E.ClassCustom',
  }
} as const;
