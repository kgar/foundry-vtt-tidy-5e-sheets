import { mount } from 'svelte';
import ApplyTidySheetPreferences from './ApplyTidySheetPreferences.svelte';
import { Tidy5eVehicleSheet } from 'src/sheets/classic/Tidy5eKgarVehicleSheet.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { error } from 'src/utils/logging';
import { SvelteApplicationMixin } from 'src/mixins/SvelteApplicationMixin.svelte';
import type { ApplicationConfiguration } from 'src/types/application.types';
import { Tidy5eItemSheetQuadrone } from 'src/sheets/quadrone/Tidy5eItemSheetQuadrone.svelte';
import { Tidy5eContainerSheetQuadrone } from 'src/sheets/quadrone/Tidy5eContainerSheetQuadrone.svelte';
import { CONSTANTS } from 'src/constants';
import { applyThemeToApplication } from 'src/utils/applications.svelte';
import { Tidy5eCharacterSheetQuadrone } from 'src/sheets/quadrone/Tidy5eCharacterSheetQuadrone.svelte';
import { Tidy5eNpcSheetQuadrone } from 'src/sheets/quadrone/Tidy5eNpcSheetQuadrone.svelte';
import { Tidy5eGroupSheetQuadrone } from 'src/sheets/quadrone/Tidy5eGroupSheetQuadrone.svelte';

export type SheetPreferenceOption = {
  label: string;
  documentName: string;
  subType: string;
  sheetClassIdentifier: string;
  selected: boolean;
};

// Regrettably manual, but hopefully a temporary arrangement
const supportedSheetClasses: string[] = [
  Tidy5eCharacterSheetQuadrone.name,
  Tidy5eNpcSheetQuadrone.name,
  Tidy5eVehicleSheet.name,
  Tidy5eItemSheetQuadrone.name,
  Tidy5eContainerSheetQuadrone.name,
  Tidy5eGroupSheetQuadrone.name,
];

export class ApplyTidySheetPreferencesApplication extends SvelteApplicationMixin<
  Partial<ApplicationConfiguration> | undefined,
  {}
>(foundry.applications.api.ApplicationV2) {
  sheetOptions = $state<SheetPreferenceOption[]>([]);

  static DEFAULT_OPTIONS = {
    classes: [
      CONSTANTS.MODULE_ID,
      'tidy5e-sheet-preferences',
      'application-shell',
      CONSTANTS.SHEET_LAYOUT_CLASSIC,
    ],
    id: 'tidy5e-sheet-preferences',
    tag: 'div',
    window: {
      frame: true,
      positioned: true,
      resizable: true,
      controls: [],
      title: 'TIDY5E.Settings.SheetPreferences.name',
    },
    position: {
      width: 650,
      height: 500,
    },
  };

  _createComponent(node: HTMLElement): Record<string, any> {
    this.sheetOptions = this.getTidySheetPreferenceOptions();

    return mount(ApplyTidySheetPreferences, {
      target: node,
      props: {
        options: this.sheetOptions,
        onConfirm: this._onConfirm.bind(this),
      },
    });
  }

  getTidySheetPreferenceOptions(): SheetPreferenceOption[] {
    const sheetClassOptions = [];
    const documentSheetConfig = foundry.applications.apps.DocumentSheetConfig;

    const setting = game.settings.get('core', 'sheetClasses');

    for (const { name, documentName, hasTypeData } of Object.values<any>(
      foundry.documents
    )) {
      // documentName -> e.g., "Actor", "Item", ...
      if (!hasTypeData) {
        continue;
      }

      if (name.startsWith('Base')) {
        continue;
      }

      // e.g., "character", "npc", "vehicle" for "Actor"
      const subTypes = game.documentTypes[documentName].filter(
        (t: string) => t !== CONST.BASE_DOCUMENT_TYPE
      );

      if (!subTypes.length) {
        continue;
      }

      for (let subType of subTypes) {
        const { defaultClasses } =
          documentSheetConfig.getSheetClassesForSubType(documentName, subType);

        const tidySheetClass = Object.keys(defaultClasses).find((c: string) =>
          supportedSheetClasses.includes(c.split('.').at(-1) ?? 'Not Found')
        );

        if (!tidySheetClass) {
          continue;
        }

        const typeLabel = FoundryAdapter.localize(
          // @ts-ignore
          CONFIG[documentName].typeLabels?.[subType]
        );

        const isDefault =
          tidySheetClass ===
          foundry.utils.getProperty(setting, `${documentName}.${subType}`);

        sheetClassOptions.push({
          label: typeLabel,
          documentName,
          subType,
          sheetClassIdentifier: tidySheetClass,
          selected: isDefault,
        });
      }
    }

    return sheetClassOptions;
  }

  private async _onConfirm(): Promise<void> {
    try {
      // We intend to adjust the existing settings.
      let sheetSettings = this._getSheetClassesSetting();

      // Evaluate each option.
      this.sheetOptions.forEach((o) => {
        const compositeSettingKey = `${o.documentName}.${o.subType}`;

        // When selected, simply assign the Tidy class to the appropriate subtype of the appropriate document name
        if (o.selected) {
          sheetSettings = foundry.utils.mergeObject(sheetSettings, {
            [compositeSettingKey]: o.sheetClassIdentifier,
          });
          return;
        }

        // When not selected, we want to remove any Tidy
        const currentSetting = foundry.utils.getProperty(
          sheetSettings,
          compositeSettingKey
        );
        if (currentSetting !== o.sheetClassIdentifier) {
          // The option was unselected, and the setting does not reference Tidy. Do not change it.
          return;
        }

        // The option was unselected, but the setting currently points to Tidy. Clear out this setting.
        delete sheetSettings[o.documentName][o.subType];

        // Prune settings where the document name no longer has any subtype properties.
        if (Object.keys(sheetSettings[o.documentName]).length === 0) {
          delete sheetSettings[o.documentName];
        }
      });

      await game.settings.set('core', 'sheetClasses', sheetSettings);

      this.close();

      const proceed = await foundry.applications.api.DialogV2.confirm({
        window: {
          title: FoundryAdapter.localize('SETTINGS.ReloadPromptTitle'),
        },
        content: FoundryAdapter.localize('SETTINGS.ReloadPromptBody'),
        yes: { default: true },
      });

      if (proceed) {
        foundry.utils.debouncedReload();
      }
    } catch (e) {
      error(FoundryAdapter.localize('TIDY5E.GenericErrorNotification'), true, {
        error: e,
      });
    }
  }

  private _getSheetClassesSetting() {
    return game.settings.get('core', 'sheetClasses');
  }

  // Not going to refactor this because this application is living on borrowed time
  _attachFrameListeners() {
    super._attachFrameListeners();

    applyThemeToApplication(this.element);
  }
}
