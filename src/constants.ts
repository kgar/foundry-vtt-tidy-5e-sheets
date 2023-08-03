export const CONSTANTS = {
  MODULE_ID: 'tidy5e-sheet-kgar',
  ITEM_TYPE_EQUIPMENT: 'equipment',
  ITEM_TYPE_BACKGROUND: 'background',
  ITEM_TYPE_BACKPACK: 'backpack',
  ITEM_TYPE_CLASS: 'class',
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
  HOOKS_RENDERING_ITEM_EQUIPMENT_TABS: 'renderTidy5eKgarItemEquipmentTabs',
  HOOKS_RENDERING_ITEM_BACKGROUND_TABS: 'renderTidy5eKgarItemBackgroundTabs',
  HOOKS_RENDERING_ITEM_BACKPACK_TABS: 'renderTidy5eKgarItemBackpackTabs',
  HOOKS_RENDERING_ITEM_CLASS_TABS: 'renderTidy5eKgarItemClassTabs',
  TAB_OPTION_CLASS: 'tab-option',
  TAB_ITEM_DESCRIPTION_ID: 'description',
  TAB_ITEM_DETAILS_ID: 'details',
  TAB_ITEM_ADVANCEMENT_ID: 'advancement',
} as const;
