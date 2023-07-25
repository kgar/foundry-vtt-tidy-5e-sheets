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
    artificer: 'T5EK.ClassArtificer',
    barbarian: 'T5EK.ClassBarbarian',
    bard: 'T5EK.ClassBard',
    cleric: 'T5EK.ClassCleric',
    druid: 'T5EK.ClassDruid',
    fighter: 'T5EK.ClassFighter',
    monk: 'T5EK.ClassMonk',
    paladin: 'T5EK.ClassPaladin',
    ranger: 'T5EK.ClassRanger',
    rogue: 'T5EK.ClassRogue',
    sorcerer: 'T5EK.ClassSorcerer',
    warlock: 'T5EK.ClassWarlock',
    wizard: 'T5EK.ClassWizard',
    custom: 'T5EK.ClassCustom',
  },
  HOOKS_RENDERING_CHARACTER_TABS: 'renderTidy5eKgarCharacterTabs',
} as const;
