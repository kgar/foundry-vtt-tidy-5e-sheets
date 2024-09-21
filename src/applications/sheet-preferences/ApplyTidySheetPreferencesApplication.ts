import type { SvelteComponent } from 'svelte';
import SvelteFormApplicationBase from '../SvelteFormApplicationBase';
import ApplyTidySheetPreferences from './ApplyTidySheetPreferences.svelte';
import { Tidy5eCharacterSheet } from 'src/sheets/Tidy5eCharacterSheet';
import { Tidy5eNpcSheet } from 'src/sheets/Tidy5eNpcSheet';
import { Tidy5eVehicleSheet } from 'src/sheets/Tidy5eKgarVehicleSheet';
import { Tidy5eKgarContainerSheet } from 'src/sheets/Tidy5eContainerSheet';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { debug, error } from 'src/utils/logging';
import { Tidy5eItemSheetClassic } from 'src/sheets/Tidy5eItemSheetClassic';

export type SheetPreferenceOption = {
  label: string;
  documentName: string;
  subType: string;
  sheetClassIdentifier: string;
  selected: boolean;
};

// Regrettably manual, but hopefully a temporary arrangement
const supportedSheetClasses: string[] = [
  Tidy5eCharacterSheet.name,
  Tidy5eNpcSheet.name,
  Tidy5eVehicleSheet.name,
  Tidy5eItemSheetClassic.name,
  Tidy5eKgarContainerSheet.name,
];

export class ApplyTidySheetPreferencesApplication extends SvelteFormApplicationBase {
  static get defaultOptions() {
    return FoundryAdapter.mergeObject(super.defaultOptions, {
      width: 650,
      height: 500,
      id: 'tidy-5e-sheet-preferences',
      popOut: true,
      title: FoundryAdapter.localize('TIDY5E.Settings.SheetPreferences.name'),
    });
  }

  createComponent(node: HTMLElement): SvelteComponent<any, any, any> {
    return new ApplyTidySheetPreferences({
      target: node,
      props: {
        options: this.getTidySheetPreferenceOptions(),
        onConfirm: this._onConfirm.bind(this),
      },
    });
  }

  getTidySheetPreferenceOptions(): SheetPreferenceOption[] {
    const sheetClassOptions = [];

    const setting = game.settings.get('core', 'sheetClasses');

    for (const { documentName, hasTypeData } of Object.values<any>(
      foundry.documents
    )) {
      // documentName -> e.g., "Actor", "Item", ...
      if (!hasTypeData) {
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
          DocumentSheetConfig.getSheetClassesForSubType(documentName, subType);

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
          tidySheetClass === foundry.utils.getProperty(setting, `${documentName}.${subType}`);

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

  private async _onConfirm(options: SheetPreferenceOption[]): Promise<void> {
    try {
      // We intend to adjust the existing settings.
      let sheetSettings = this.getSheetClassesSetting();

      // Evaluate each option.
      options.forEach((o) => {
        const compositeSettingKey = `${o.documentName}.${o.subType}`;

        // When selected, simply assign the Tidy class to the appropriate subtype of the appropriate document name
        if (o.selected) {
          debug(
            `Tidy Sheet ${o.sheetClassIdentifier} selected; ensuring it is set in settings.`
          );
          sheetSettings = foundry.utils.mergeObject(sheetSettings, {
            [compositeSettingKey]: o.sheetClassIdentifier,
          });
          return;
        }

        debug(
          `Tidy Sheet ${o.sheetClassIdentifier} unselected; checking setting.`
        );
        // When not selected, we want to remove any Tidy
        const currentSetting = foundry.utils.getProperty(
          sheetSettings,
          compositeSettingKey
        );
        if (currentSetting !== o.sheetClassIdentifier) {
          debug(
            `Tidy Sheet ${o.sheetClassIdentifier} not currently configured and is unselected; ignoring.`
          );
          // The option was unselected, and the setting does not reference Tidy. Do not change it.
          return;
        }

        debug(
          `Tidy Sheet ${o.sheetClassIdentifier} currently configured and is unselected; removing setting.`
        );
        // The option was unselected, but the setting currently points to Tidy. Clear out this setting.
        delete sheetSettings[o.documentName][o.subType];

        // Prune settings where the document name no longer has any subtype properties.
        if (Object.keys(sheetSettings[o.documentName]).length === 0) {
          debug(
            `${o.documentName} is now empty. Pruning property from settings.`
          );
          delete sheetSettings[o.documentName];
        }
      });

      await game.settings.set('core', 'sheetClasses', sheetSettings);

      debug('New sheetClasses settings', { sheetClasses: sheetSettings });

      this.close();

      Dialog.confirm({
        title: FoundryAdapter.localize('SETTINGS.ReloadPromptTitle'),
        content: FoundryAdapter.localize('SETTINGS.ReloadPromptBody'),
        yes: () => foundry.utils.debouncedReload(),
        no: () => {},
        defaultYes: true,
      });
    } catch (e) {
      error(FoundryAdapter.localize('TIDY5E.GenericErrorNotification'), true, {
        error: e,
      });
    }
  }

  private getSheetClassesSetting() {
    return game.settings.get('core', 'sheetClasses');
  }
}
