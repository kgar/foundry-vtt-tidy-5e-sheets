import type { SortMode } from "src/types/types";

export type SheetTypeTabPreferences = {
  sort?: SortMode;
};

export type SheetPreference = {
  tabs?: {
    [tabId: string]: SheetTypeTabPreferences;
  };
  width?: number;
  height?: number;
};

export type SheetPreferences = {
  [sheetType: string]: SheetPreference;
};
