import { CONSTANTS } from 'src/constants';
import type {
  CharacterSheetContext,
  NpcSheetContext,
  Tab,
  VehicleSheetContext,
} from 'src/types/types';

export type SheetTabState<TContext> = Tab & {
  /**
   * Determines whether the tab should be visible when viewing the sheet.
   */
  enabled: boolean | ((context: TContext) => boolean);

  /**
   * The layout(s) which should support this tab (default: 'all')
   */
  layout?: SheetLayout;
};

/**
 * Controllable sheet state for player characters. This sheet state is meant to be adjusted
 * by other modules through the API to affect how the target sheet is presented.
 */
export type CharacterSheetState = {
  /**
   * All registered sheet tabs.
   */
  sheetTabs: SheetTabState<CharacterSheetContext>[];
};

/**
 * Controllable sheet state for NPCs. This sheet state is meant to be adjusted
 * by other modules through the API to affect how the target sheet is presented.
 */
export type NpcSheetState = {
  sheetTabs: SheetTabState<NpcSheetContext>[];
};

/**
 * Controllable sheet state for vehicles. This sheet state is meant to be adjusted
 * by other modules through the API to affect how the target sheet is presented.
 */
export type VehicleSheetState = {
  sheetTabs: SheetTabState<VehicleSheetContext>[];
};

/**
 * One of the supported layouts of Tidy 5e sheets.
 */
export type SheetLayout =
  | typeof CONSTANTS.SHEET_LAYOUT_ALL
  | typeof CONSTANTS.SHEET_LAYOUT_CLASSIC; // More to come ;)

export type SheetTabRegistrationOptions = {
  /**
   * Overwrite an existing sheet tab with the same id, if found.
   */
  overwrite?: boolean;
};
