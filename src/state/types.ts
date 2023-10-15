import type {
  CharacterSheetContext,
  NpcSheetContext,
  Tab,
  VehicleSheetContext,
} from 'src/types/types';

export type SheetTabState<TContext> = Tab & {
  enabled: boolean | ((context: TContext) => boolean);
  order: number;
};

export type CharacterSheetState = {
  sheetTabs: SheetTabState<CharacterSheetContext>[];
};

export type NpcSheetState = {
  sheetTabs: SheetTabState<NpcSheetContext>[];
};

export type VehicleSheetState = {
  sheetTabs: SheetTabState<VehicleSheetContext>[];
};

export type SheetTabRegistrationOptions = {
  /**
   * Overwrite an existing sheet tab with the same id, if found. 
   */
  overwrite?: boolean;
}