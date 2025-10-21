import type { CONSTANTS } from 'src/constants';

export type UserSheetTypeTabPreferences = {
  sort?: string;
  sidebarExpanded?: boolean;
  showSheetPins?: boolean;
};

export type UserSheetPreference = {
  tabs?: {
    [tabId: string]: UserSheetTypeTabPreferences;
  };
  width?: number | 'auto';
  height?: number | 'auto';
  [CONSTANTS.SPELL_SLOT_TRACKER_MODE_PREFERENCE]?:
    | typeof CONSTANTS.SPELL_SLOT_TRACKER_MODE_PIPS
    | typeof CONSTANTS.SPELL_SLOT_TRACKER_MODE_VALUE_MAX;
};

export type UserSheetPreferences = {
  [sheetType: string]: UserSheetPreference;
};

export type ExpandCollapseBehavior = 'top-level' | 'all';

export type UserPreferences = {
  expandCollapseBehavior: ExpandCollapseBehavior;
  [CONSTANTS.SPELL_CAST_ACTIVITY_GROUPING_PREFERENCE]?:
    | typeof CONSTANTS.SPELL_CAST_ACTIVITY_GROUPING_ADDITIONAL
    | typeof CONSTANTS.SPELL_CAST_ACTIVITY_GROUPING_PER_ITEM;
  [CONSTANTS.SHOW_LEGENDARIES_ON_NPC_STATBLOCK_PREFERENCE]?: boolean;
  [CONSTANTS.INCLUDE_SPELLBOOK_IN_NPC_STATBLOCK_PREFERENCE]?: boolean;
};
