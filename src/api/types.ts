import type {
  CharacterSheetContext,
  NpcSheetContext,
  Tab,
  VehicleSheetContext,
} from 'src/types/types';

export type SheetTabRuntimeConfig<TContext> = Tab & {
  enabled: boolean | ((context: TContext) => boolean);
  order: number;
};

export type CharacterSheetRuntimeConfig = {
  sheetTabs: SheetTabRuntimeConfig<CharacterSheetContext>[];
};

export type NpcSheetRuntimeConfig = {
  sheetTabs: SheetTabRuntimeConfig<NpcSheetContext>[];
};

export type VehicleSheetRuntimeConfig = {
  sheetTabs: SheetTabRuntimeConfig<VehicleSheetContext>[];
};
