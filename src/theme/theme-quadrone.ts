import { TidyExtensibleDocumentSheetMixin } from 'src/mixins/TidyDocumentSheetMixin.svelte';
import type { Tidy5eCharacterSheetQuadrone } from 'src/sheets/quadrone/Tidy5eCharacterSheetQuadrone.svelte';
import type { Tidy5eContainerSheetQuadrone } from 'src/sheets/quadrone/Tidy5eContainerSheetQuadrone.svelte';
import type { Tidy5eItemSheetQuadrone } from 'src/sheets/quadrone/Tidy5eItemSheetQuadrone.svelte';
import type { Tidy5eNpcSheetQuadrone } from 'src/sheets/quadrone/Tidy5eNpcSheetQuadrone.svelte';
import type { ThemeSettings } from './theme-quadrone.types';
import { TidyFlags } from 'src/api';

export type ThemeableSheetType =
  | Tidy5eCharacterSheetQuadrone
  | Tidy5eNpcSheetQuadrone
  | Tidy5eItemSheetQuadrone
  | Tidy5eContainerSheetQuadrone;

export class ThemeQuadrone {
  static getDefaultThemeSettings(): ThemeSettings {
    return {
      accentColor: '',
      headerBackground: '',
      rarityColors: [],
      spellPreparationModeColors: [],
      useSaturatedRarityColors: false,
    };
  }

  static applySheetTheme(sheet: ThemeableSheetType) {
    // get sheet settings
    // get or create style tag
  }

  static getSheetThemeSettings(sheet: ThemeableSheetType) {
    const preferences = TidyFlags.sheetThemeSettings.get(sheet.document);

    // TODO: Clean up and backfill as needed. It could even just be a Foundry merge

    return preferences;
  }

  // Apply Styles functions

  // Get World Settings - should do any cleanup (data models in the future)

  // Save World Settings - should do any validation / cleanup before saving

  // Get Sheet Settings - should do any cleanup (data models in the future)

  // Save Sheet Settings - should do any validation / cleanup before saving
}
