const moduleId = 'tidy5e-sheet';
export const CONSTANTS = {
  ALPHA_MODULE_ID: 'tidy5e-sheet-kgar',
  MODULE_ID: moduleId,
  DND5E_SYSTEM_ID: 'dnd5e',
  SYSTEM_SETTING_DISABLE_EXPERIENCE_TRACKING: 'disableExperienceTracking',
  DOCUMENT_NAME_ACTOR: 'Actor',
  ATTUNEMENT_OPTIONAL: 'optional',
  ATTUNEMENT_REQUIRED: 'required',
  ITEM_CAPACITY_TYPE_ITEMS: 'items',
  ITEM_CAPACITY_TYPE_WEIGHT: 'weight',
  ITEM_TYPE_BACKGROUND: 'background',
  ITEM_TYPE_CLASS: 'class',
  ITEM_TYPE_CONSUMABLE: 'consumable',
  ITEM_TYPE_CONTAINER: 'container',
  ITEM_TYPE_EQUIPMENT: 'equipment',
  ITEM_TYPE_FEAT: 'feat',
  ITEM_TYPE_LOOT: 'loot',
  ITEM_TYPE_RACE: 'race',
  ITEM_TYPE_SPELL: 'spell',
  ITEM_TYPE_SUBCLASS: 'subclass',
  ITEM_TYPE_TOOL: 'tool',
  ITEM_TYPE_WEAPON: 'weapon',
  ITEM_SYSTEM_TYPE_AMMO: 'ammo',
  MESSAGE_BUS_COLLAPSE_ALL: 'collapse-all',
  MESSAGE_BUS_EXPAND_ALL: 'expand-all',
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
  CONTEXT_MENU_TYPE_GROUP_MEMBER: 'group-member',
  CONTEXT_MENU_TYPE_ITEMS: 'items',
  CONTEXT_MENU_TYPE_ITEM_ADVANCEMENT: 'item-advancement',
  DND5E_CLASSES: {
    artificer: 'TIDY5E.Class.Artificer',
    barbarian: 'TIDY5E.Class.Barbarian',
    bard: 'TIDY5E.Class.Bard',
    cleric: 'TIDY5E.Class.Cleric',
    druid: 'TIDY5E.Class.Druid',
    fighter: 'TIDY5E.Class.Fighter',
    monk: 'TIDY5E.Class.Monk',
    paladin: 'TIDY5E.Class.Paladin',
    ranger: 'TIDY5E.Class.Ranger',
    rogue: 'TIDY5E.Class.Rogue',
    sorcerer: 'TIDY5E.Class.Sorcerer',
    warlock: 'TIDY5E.Class.Warlock',
    wizard: 'TIDY5E.Class.Wizard',
    custom: 'TIDY5E.Class.Custom',
  },
  CHARACTER_FAVORITE_SECTION_GENERIC: 'generic',
  CHARACTER_FEAT_SECTION_BACKGROUND: 'background',
  CHARACTER_FEAT_SECTION_CLASSES: 'classes',
  CHARACTER_FEAT_SECTION_ACTIVE: 'active',
  CHARACTER_FEAT_SECTION_PASSIVE: 'passive',
  CHARACTER_FEAT_SECTION_RACE: 'race',
  GROUP_TYPE_GROUP: '',
  GROUP_TYPE_ENCOUNTER: 'encounter',
  GROUP_TYPE_PARTY: 'party',
  NPC_ABILITY_SECTION_WEAPONS: 'weapons',
  NPC_ABILITY_SECTION_ACTIONS: 'actions',
  NPC_ABILITY_SECTION_PASSIVE: 'passive',
  NPC_ABILITY_SECTION_EQUIPMENT: 'equipment',
  NPC_ABILITY_SECTION_CLASSES: 'classes',
  TAB_OPTION_CLASS: 'tab-option',
  TAB_ACTOR_INVENTORY: 'inventory',
  TAB_CONTAINER_CONTENTS: 'contents',
  TAB_CONTAINER_SECTION_CONTENTS: 'contents',
  TAB_ITEM_DESCRIPTION_ID: 'description',
  TAB_ITEM_DETAILS_ID: 'details',
  TAB_ITEM_ADVANCEMENT_ID: 'advancement',
  TAB_ITEM_EFFECTS_ID: 'effects',
  TAB_CHARACTER_ATTRIBUTES: 'attributes',
  TAB_CHARACTER_SPELLBOOK: 'spellbook',
  TAB_CHARACTER_FEATURES: 'features',
  TAB_CHARACTER_EFFECTS: 'effects',
  TAB_CHARACTER_BIOGRAPHY: 'biography',
  TAB_CHARACTER_JOURNAL: 'journal',
  TAB_GROUP_MEMBERS: 'members',
  TAB_GROUP_DESCRIPTION: 'description',
  TAB_MIGRATIONS_V1_ONBOARDING: 'v1-onboarding',
  TAB_MIGRATIONS_CHARACTER_BIOGRAPHY: 'character-bio',
  TAB_MIGRATIONS_NPC_DEATH: 'npc-death',
  TAB_MIGRATIONS_CCSS_TO_TIDY: 'ccss-to-tidy',
  TAB_MIGRATIONS_FAVORITES_TO_SYSTEM: 'favorites-to-system',
  TAB_MIGRATIONS_BONDS_IDEALS_FLAWS_TO_SYSTEM: 'bonds-ideals-flaws-to-system',
  TAB_MIGRATIONS_SPELL_CLASS_TO_SOURCE_CLASS: 'spell-class-to-source-class',
  TAB_MIGRATIONS_NPC_EXHAUSTION: 'npc-exhaustion',
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
  TAB_WORLD_SETTINGS_CHARACTER: 'world-settings-character',
  TAB_WORLD_SETTINGS_NPC: 'world-settings-npc',
  TAB_WORLD_SETTINGS_VEHICLE: 'world-settings-vehicle',
  TAB_WORLD_SETTINGS_ICONS: 'world-settings-icons',
  TAB_WORLD_SETTINGS_ITEM: 'world-settings-item',
  TAB_WORLD_SETTINGS_EXHAUSTION: 'world-settings-exhaustion',
  TAB_WORLD_SETTINGS_SHEETLOCK: 'world-settings-sheet-lock',
  TAB_WORLD_SETTINGS_MISC: 'world-settings-misc',
  TAB_USER_SETTINGS_PLAYERS: 'user-settings-players',
  TAB_USER_SETTINGS_NPCS: 'user-settings-npcs',
  TAB_USER_SETTINGS_VEHICLES: 'user-settings-vehicles',
  TAB_USER_SETTINGS_ACTIONS_LIST: 'user-settings-actions-list',
  THEME_EXTENSION_WITH_DOT: '.tidy5e-theme',
  THEME_ID_DEFAULT_LIGHT: 'light',
  THEME_ID_DEFAULT_DARK: 'dark',
  THEME_ID_DEFAULT: 'default',
  SHEET_TYPE_CHARACTER: 'character',
  SHEET_TYPE_NPC: 'npc',
  SHEET_TYPE_VEHICLE: 'vehicle',
  SHEET_TYPE_CONTAINER: 'container',
  SHEET_TYPE_GROUP: 'group',
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
  SPELL_PREPARATION_MODE_RITUAL: 'ritual',
  SPELL_SLOT_TRACKER_MODE_PREFERENCE: 'spellSlotTrackerMode',
  SPELL_SLOT_TRACKER_MODE_PIPS: 'pips',
  SPELL_SLOT_TRACKER_MODE_VALUE_MAX: 'value-max',
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
    /** An interactable control that can open configuration settings for a target ability. */
    ABILITY_CONFIGURATION_CONTROL: 'ability-configuration-control',

    /** A rollable/interactable element which rolls an ability save or test. */
    ABILITY_ROLLER: 'ability-roller',

    /** An interactable toggle for ability saving throw proficiency. */
    ABILITY_SAVE_PROFICIENCY_TOGGLE: 'ability-save-proficiency-toggle',

    /** An ability score (e.g., "str", "dex", "wis", etc.), whether readonly or editable. */
    ABILITY_SCORE: 'ability-score',

    /** A rollable/interactable element which rolls an ability save. */
    ABILITY_SAVE_ROLLER: 'ability-save-roller',

    /** A container for a given ability score (e.g., "str", "dex", "wis", etc.). */
    ABILITY_SCORE_CONTAINER: 'ability-score-container',

    /** A rollable/interactable element which rolls an ability test. */
    ABILITY_TEST_ROLLER: 'ability-test-roller',

    /** A container which houses an actor portrait and other parts related to actor portrait features. */
    ACTOR_PORTRAIT_CONTAINER: 'actor-portrait-container',

    /** An overlay element for an actor portrait which provides a visual representation of remaining health. */
    ACTOR_PORTRAIT_HEALTH_OVERLAY: 'actor-portrait-health-overlay',

    /** An actor portrait image element. */
    ACTOR_PORTRAIT_IMAGE: 'actor-portrait-image',

    /** An actor trait container, such as Senses, Languages, or Tools. */
    ACTOR_TRAIT: 'actor-trait',

    /** The specific details of an actor trait container, such as Senses, Languages, or Tools. */
    ACTOR_TRAIT_DETAILS: 'actor-trait-details',

    /** A control for toggling a condition */
    CONDITION_TOGGLE: 'condition-toggle',

    /** A container for all form fields related to a given damage part. */
    DAMAGE_PART_CONTAINER: 'damage-part-container',

    /** An interactable control which the user can execute to delete a damage part to an item. */
    DAMAGE_PART_DELETE_COMMAND: 'damage-part-delete-command',

    /** An input element which contains a damage part formula, usually for an item. */
    DAMAGE_PART_FORMULA: 'damage-part-formula',

    /** An input element which represents the damage type of a damage part, usually for an item. */
    DAMAGE_PART_TYPE: 'damage-part-type',

    /** An input for the number of failed death saves an actor has. */
    DEATH_SAVE_FAILURES: 'death-save-failures',

    /** A rollable/interactable element which rolls a death saving throw. */
    DEATH_SAVE_ROLLER: 'death-save-roller',

    /** An input for the number of successful death saves an actor has. */
    DEATH_SAVE_SUCCESSES: 'death-save-successes',

    /** An interactable element which toggles a view */
    EXPANSION_TOGGLE: 'table-expansion-toggle',

    /** An image representing a member of a group sheet. */
    GROUP_MEMBER_PORTRAIT: 'group-member-portrait',

    /** An interactable element which toggles an inline container's contents view */
    INLINE_CONTAINER_TOGGLE: 'inline-container-toggle',

    /** An interactable control which the user can execute to create an item (e.g., consumable, feature, loot, spell, weapon, etc.). */
    ITEM_CREATE_COMMAND: 'item-create-command',

    /** An image element for an item. */
    ITEM_IMAGE: 'item-image',

    /** The container element for an item image. */
    ITEM_IMAGE_CONTAINER: 'item-image-container',

    /** An element which contains the name of an item. */
    ITEM_NAME: 'item-name',

    /** A list-based tabular representation of items (e.g., equipment, loot, spells, etc.). */
    ITEM_TABLE: 'item-table',

    /** The header row of an item table. */
    ITEM_TABLE_HEADER_ROW: 'item-table-header-row',

    /** A row in an item table. */
    ITEM_TABLE_ROW: 'item-table-row',

    /** An interactable control which the user can execute to use an item (e.g., consumable, feature, loot, spell, weapon, etc.). */
    ITEM_USE_COMMAND: 'item-use-command',

    /** A series of properties related to an item, to be found on item summaries, item cards, and other locations where read-only item information is given. */
    ITEM_PROPERTY_LIST: 'item-property-list',

    /** A series of properties related to an item, viewed from that item's sheet. These include read-only properties, currency value, and other situational input. */
    ITEM_SHEET_PROPERTIES: 'item-sheet-properties',

    /** A summary of an item, usually taken from the item's chat data. */
    ITEM_SUMMARY: 'item-summary',

    /** A containing element for a series of item lists or grids. */
    ITEMS_CONTAINER: 'items-container',

    /** The element which contains the modifier text for melee spell attacks. */
    MELEE_SPELL_ATTACK_MOD: 'melee-spell-attack-mod',

    /**
     * A container for a sheet name. The sheet name is usually in input, and its container has some additional styles associated with it.
     * The container typically sits in a sheet header row with other header-related elements.
     */
    NAME_CONTAINER: 'name-container',

    /** The sheet header row where the sheet name appears. */
    NAME_HEADER_ROW: 'name-header-row',

    /** A containing element for a series of item lists related to the NPC Abilities tab. */
    NPC_ABILITIES_CONTAINER: 'npc-abilities-list',

    /** The element which contains the modifier text for ranged spell attacks. */
    RANGED_SPELL_ATTACK_MOD: 'ranged-spell-attack-mod',

    /** A container for a single resource (first, second, third, etc.). */
    RESOURCE: 'resource',

    /** The container where all known resources (first, second, third, etc.) are kept. */
    RESOURCES_CONTAINER: 'resources-container',

    /** An interactable element that can clear the search input it is associated with. */
    SEARCH_CLEAR: 'search-clear',

    /** A container for a search input and its search clearing interactable element. */
    SEARCH_CONTAINER: 'search-container',

    /** A user input for performing searches. */
    SEARCH_INPUT: 'search-input',

    /** An interactable control that can open configuration settings for a target skill. */
    SKILL_CONFIGURATION_CONTROL: 'skill-configuration-control',

    /** A container for a single skill, including its roller, proficiency toggle, and any other elements related to the skill. */
    SKILL_CONTAINER: 'skill-container',

    /** An interactable toggle for skill proficiency. */
    SKILL_PROFICIENCY_TOGGLE: 'skill-proficiency-toggle',

    /** A rollable/interactable element which rolls a skill check. */
    SKILL_ROLLER: 'skill-roller',

    /** A list of skills for the target actor. */
    SKILLS_LIST: 'skills-list',

    /** An interactable toggle for showing/hiding unproficienct skills. */
    SKILLS_SHOW_PROFICIENT_TOGGLE: 'skills-show-proficiency-toggle',

    /** The element which contains the modifier text for spell attacks in general. This field is shown when melee and ranged spell attack mods are the same. */
    SPELL_ATTACK_MOD: 'spell-attack-mod',

    /** The element which contains spell DC. */
    SPELL_DC: 'spell-dc',

    /** A cell in a table row. */
    TABLE_CELL: 'table-cell',

    /** A cell in a table's header row. */
    TABLE_HEADER_CELL: 'table-header-cell',

    /** The header row in a table. */
    TABLE_HEADER_ROW: 'table-header-row',

    /** A row in a table. */
    TABLE_ROW: 'table-row',

    /** An interactable control that can open configuration settings for a target tool. */
    TOOL_CONFIGURATION_CONTROL: 'tool-configuration-control',

    /** A container for a single tool, including its roller, proficiency toggle, and any other elements related to the tool. */
    TOOL_CONTAINER: 'tool-container',

    /** An interactable toggle for tool proficiency. */
    TOOL_PROFICIENCY_TOGGLE: 'tool-proficiency-toggle',

    /** A rollable/interactable element which rolls a tool check. */
    TOOL_ROLLER: 'tool-roller',

    /** A list of tools for the target actor. */
    TOOLS_LIST: 'tools-list',

    /** A toolbar that usually sits at the top of a section of content, providing features like search, filtering, etc. */
    UTILITY_TOOLBAR: 'utility-toolbar',

    /** A toolbar command, usually a button */
    UTILITY_TOOLBAR_COMMAND: 'utility-toolbar-command',
  },
  ACTIVATION_COST_ACTION: 'action',
  ACTIVATION_COST_BONUS: 'bonus',
  ACTIVATION_COST_CREW: 'crew',
  ACTIVATION_COST_LAIR: 'lair',
  ACTIVATION_COST_LEGENDARY: 'legendary',
  ACTIVATION_COST_MYTHIC: 'mythic',
  ACTIVATION_COST_NONE: 'none',
  ACTIVATION_COST_REACTION: 'reaction',
  ACTIVATION_COST_SPECIAL: 'special',
  LIMITED_USES_PER_CHARGES: 'charges',
  LIMITED_USES_PER_DAWN: 'dawn',
  LIMITED_USES_PER_DAY: 'day',
  LIMITED_USES_PER_DUSK: 'dusk',
  LIMITED_USES_PER_LONG_REST: 'lr',
  LIMITED_USES_PER_SHORT_REST: 'sr',
  SHEET_SETTINGS_OPTION_NONE: 'none',
  SHEET_SETTINGS_OPTION_GM_ONLY: 'gm-only',
  SHEET_SETTINGS_OPTION_GM_AND_OWNERS: 'gm-and-owners',
  TEXT_EDITOR_ACTIVATION_ELEMENT_SELECTOR: '.editor-content[data-edit]',
  SKILL_KEY_PERCEPTION: 'prc',
  SVELTE_CONTEXT: {
    ACCORDION_CONTEXT: 'accordionContext',
    APP_ID: 'appId',
    APPLY: 'apply',
    BUTTON_MENU_CONTEXT: 'buttonMenuContext',
    CARD: 'card',
    CONFIRM: 'confirm',
    CONTEXT: 'context',
    CURRENT_TAB_ID: 'currentTabId',
    EXPANDED_ITEM_DATA: 'expandedItemData',
    EXPANDED_ITEMS: 'expandedItems',
    FUNCTIONS: 'functions',
    INITIAL_TAB_ID: 'initialTabId',
    INLINE_CONTAINER_TOGGLE_SERVICE: 'inlineContainerToggleService',
    ITEM_FILTER_SERVICE: 'itemFilterService',
    ITEM_IDS_TO_SHOW: 'itemIdsToShow',
    ITEM_TABLE_TOGGLES: 'itemTableToggles',
    LOCATION: 'location',
    MEMBER_IDS_TO_SHOW: 'memberIdsToShow',
    MESSAGE_BUS: 'messageBus',
    ON_FILTER_CLEAR_ALL: 'onFilterClearAll',
    ON_FILTER: 'onFilter',
    ON_ITEM_TABLE_TOGGLE: 'onItemTableToggle',
    ON_ITEM_TOGGLED: 'onItemToggled',
    ON_SEARCH: 'onSearch',
    ON_TAB_SELECTED: 'onTabSelected',
    SEARCH_FILTERS: 'searchFilters',
    STATS: 'stats',
    TAB_ID: 'tabId',
    USE_DEFAULT: 'useDefault',
    VALIDATE: 'validate',
  },
} as const;
