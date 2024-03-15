import type { CONSTANTS } from 'src/constants';
import type { SortMode } from 'src/types/types';

export type SheetTypeTabPreferences = {
  sort?: SortMode;
};

export type SheetPreference = {
  tabs?: {
    [tabId: string]: SheetTypeTabPreferences;
  };
  width?: number;
  height?: number;
  [CONSTANTS.SPELL_SLOT_TRACKER_MODE_PREFERENCE]?:
    | typeof CONSTANTS.SPELL_SLOT_TRACKER_MODE_PIPS
    | typeof CONSTANTS.SPELL_SLOT_TRACKER_MODE_VALUE_MAX;
};

export type SheetPreferences = {
  [sheetType: string]: SheetPreference;
};
