import type { CONSTANTS } from 'src/constants';

export type SheetTypeTabPreferences = {
  sort?: string;
  sidebarExpanded?: boolean;
};

export type SheetPreference = {
  tabs?: {
    [tabId: string]: SheetTypeTabPreferences;
  };
  width?: number | 'auto';
  height?: number | 'auto';
  [CONSTANTS.SPELL_SLOT_TRACKER_MODE_PREFERENCE]?:
    | typeof CONSTANTS.SPELL_SLOT_TRACKER_MODE_PIPS
    | typeof CONSTANTS.SPELL_SLOT_TRACKER_MODE_VALUE_MAX;
};

export type SheetPreferences = {
  [sheetType: string]: SheetPreference;
};

export type ExpandCollapseBehavior = 'top-level' | 'all';

export type UserPreferences = {
  expandCollapseBehavior: ExpandCollapseBehavior;
  [CONSTANTS.SPELL_CAST_ACTIVITY_GROUPING_PREFERENCE]?:
    | typeof CONSTANTS.SPELL_CAST_ACTIVITY_GROUPING_ADDITIONAL
    | typeof CONSTANTS.SPELL_CAST_ACTIVITY_GROUPING_PER_ITEM;
  [CONSTANTS.SHOW_LEGENDARIES_ON_NPC_STATBLOCK_PREFERENCE]?: boolean;
};
