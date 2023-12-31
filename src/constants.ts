const moduleId = 'tidy5e-sheet-kgar';
export const CONSTANTS = {
  MODULE_ID: moduleId,
  DND5E_SYSTEM_ID: 'dnd5e',
  // TODO: inject moduleId variable when this module overtakes the original
  HOOK_TIDY5E_SHEETS_READY: `tidy5e-sheet.ready`,
  HOOK_TIDY5E_SHEETS_PREPARE_RESOURCES: `tidy5e-sheet.prepareResources`,
  HOOK_TIDY5E_SHEETS_ITEM_HOVER_ON: `tidy5e-sheet.itemHoverOn`,
  HOOK_TIDY5E_SHEETS_ITEM_HOVER_OFF: `tidy5e-sheet.itemHoverOff`,
  ITEM_TYPE_EQUIPMENT: 'equipment',
  ITEM_TYPE_BACKGROUND: 'background',
  ITEM_TYPE_BACKPACK: 'backpack',
  ITEM_TYPE_CLASS: 'class',
  ITEM_TYPE_CONSUMABLE: 'consumable',
  ITEM_TYPE_FEAT: 'feat',
  ITEM_TYPE_LOOT: 'loot',
  ITEM_TYPE_SPELL: 'spell',
  ITEM_TYPE_SUBCLASS: 'subclass',
  ITEM_TYPE_TOOL: 'tool',
  ITEM_TYPE_WEAPON: 'weapon',
  ITEM_TYPE_RACE: 'race',
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
  CONTEXT_MENU_TYPE_ITEM_ADVANCEMENT: 'item-advancement',
  DND5E_CLASSES: {
    artificer: 'T5EK.Class.Artificer',
    barbarian: 'T5EK.Class.Barbarian',
    bard: 'T5EK.Class.Bard',
    cleric: 'T5EK.Class.Cleric',
    druid: 'T5EK.Class.Druid',
    fighter: 'T5EK.Class.Fighter',
    monk: 'T5EK.Class.Monk',
    paladin: 'T5EK.Class.Paladin',
    ranger: 'T5EK.Class.Ranger',
    rogue: 'T5EK.Class.Rogue',
    sorcerer: 'T5EK.Class.Sorcerer',
    warlock: 'T5EK.Class.Warlock',
    wizard: 'T5EK.Class.Wizard',
    custom: 'T5EK.Class.Custom',
  },
  TAB_OPTION_CLASS: 'tab-option',
  TAB_ITEM_DESCRIPTION_ID: 'description',
  TAB_ITEM_DETAILS_ID: 'details',
  TAB_ITEM_ADVANCEMENT_ID: 'advancement',
  TAB_ITEM_EFFECTS_ID: 'effects',
  TAB_CHARACTER_ATTRIBUTES: 'attributes',
  TAB_CHARACTER_INVENTORY: 'inventory',
  TAB_CHARACTER_SPELLBOOK: 'spellbook',
  TAB_CHARACTER_FEATURES: 'features',
  TAB_CHARACTER_EFFECTS: 'effects',
  TAB_CHARACTER_BIOGRAPHY: 'biography',
  TAB_CHARACTER_JOURNAL: 'journal',
  TAB_NPC_ABILITIES: 'attributes',
  TAB_NPC_SPELLBOOK: 'spellbook',
  TAB_NPC_EFFECTS: 'effects',
  TAB_NPC_BIOGRAPHY: 'biography',
  TAB_NPC_JOURNAL: 'journal',
  TAB_VEHICLE_ATTRIBUTES: 'attributes',
  TAB_VEHICLE_CARGO_AND_CREW: 'cargo',
  TAB_VEHICLE_EFFECTS: 'effects',
  TAB_VEHICLE_DESCRIPTION: 'biography',
  TAB_ACTOR_ACTIONS: 'actions',
  TAB_SETTINGS_PLAYERS: 'players',
  TAB_SETTINGS_NPCS: 'npcs',
  TAB_SETTINGS_VEHICLES: 'vehicles',
  TAB_SETTINGS_GM: 'gm',
  TAB_SETTINGS_MODULES: 'modules',
  TAB_SETTINGS_HOMEBREW: 'homebrew',
  TAB_SETTINGS_LOCKS: 'locks',
  TAB_SETTINGS_FEATURES: 'features',
  TAB_SETTINGS_INFO: 'info',
  THEME_EXTENSION_WITH_DOT: '.tidy5e-theme',
  THEME_ID_DEFAULT_LIGHT: 'light',
  THEME_ID_DEFAULT_DARK: 'dark',
  THEME_ID_DEFAULT: 'default',
  SHEET_TYPE_CHARACTER: 'character',
  SHEET_TYPE_NPC: 'npc',
  SHEET_TYPE_VEHICLE: 'vehicle',
  SHEET_LAYOUT_ALL: 'all',
  SHEET_LAYOUT_CLASSIC: 'classic',
  CIRCULAR_PORTRAIT_OPTION_ALL: 'all',
  CIRCULAR_PORTRAIT_OPTION_CHARACTER: 'pc',
  CIRCULAR_PORTRAIT_OPTION_NPCVEHICLE: 'npc-vehicle',
  CIRCULAR_PORTRAIT_OPTION_NONE: 'none',
  SPELL_PREPARATION_MODE_INNATE: 'innate',
  SPELL_PREPARATION_MODE_PREPARED: 'prepared',
  SPELL_PREPARATION_MODE_ALWAYS: 'always',
  SPELL_PREPARATION_MODE_PACT: 'pact',
  SPELL_PREPARATION_MODE_ATWILL: 'atwill',
  CONTEXT_GRID_CELL_HOVER: 'grid-cell-hover',
  CLASS_TIDY_USE_CORE_LISTENERS: 'tidy-use-core-listeners',
  CLASS_SELECTOR_TIDY_USE_CORE_LISTENERS: '.tidy-use-core-listeners',
  CLASS_ACTOR_SHEET_5E: 'ActorSheet5e',
  HTML_DYNAMIC_RENDERING_ATTRIBUTE: 'data-tidy-render-scheme="handlebars"',
  HTML_DYNAMIC_RENDERING_ATTRIBUTE_SELECTOR:
    '[data-tidy-render-scheme="handlebars"]',
  /** The attribute which indicates a particular part of a sheet. */
  SHEET_PART_ATTRIBUTE: 'data-tidy-sheet-part',
  SHEET_PARTS: {
    /**
     * A container for a sheet name. The sheet name is usually in input, and its container has some additional styles associated with it.
     * The container typically sits in a sheet header row with other header-related elements.
     */
    NAME_CONTAINER: 'name-container',
    /**
     * The sheet header row where the sheet name appears.
     */
    NAME_HEADER_ROW: 'name-header-row',
    /**
     * A container for a single resource (first, second, third, etc.).
     */
    RESOURCE: 'resource',
    /**
     * The container where all known resources (first, second, third, etc.) are kept.
     */
    RESOURCES_CONTAINER: 'resources-container',
  },
} as const;
