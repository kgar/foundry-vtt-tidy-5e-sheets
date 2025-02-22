import { mount } from 'svelte';
import SvelteFormApplicationBase from '../SvelteFormApplicationBase';
import ApplyTidySheetPreferences from './ApplyTidySheetPreferences.svelte';
import { Tidy5eCharacterSheet } from 'src/sheets/classic/Tidy5eCharacterSheet.svelte';
import { Tidy5eNpcSheet } from 'src/sheets/classic/Tidy5eNpcSheet.svelte';
import { Tidy5eVehicleSheet } from 'src/sheets/classic/Tidy5eKgarVehicleSheet.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { debug, error } from 'src/utils/logging';
import { Tidy5eItemSheetClassic } from 'src/sheets/classic/Tidy5eItemSheetClassic.svelte';
import { Tidy5eGroupSheetClassic } from 'src/sheets/classic/Tidy5eGroupSheetClassic.svelte';
import { Tidy5eContainerSheetClassic } from 'src/sheets/classic/Tidy5eContainerSheetClassic.svelte';

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
  Tidy5eContainerSheetClassic.name,
  Tidy5eGroupSheetClassic.name,
];

export class ApplyTidySheetPreferencesApplication extends SvelteFormApplicationBase {
  sheetOptions = $state<SheetPreferenceOption[]>([]);

  static get defaultOptions() {
    return FoundryAdapter.mergeObject(super.defaultOptions, {
      width: 650,
      height: 500,
      id: 'tidy-5e-sheet-preferences',
      popOut: true,
      title: FoundryAdapter.localize('TIDY5E.Settings.SheetPreferences.name'),
    });
  }

  createComponent(node: HTMLElement): Record<string, any> {
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
    const documentSheetConfig =
      game.release.generation < 13
        ? DocumentSheetConfig
        : foundry.applications.apps.DocumentSheetConfig;

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
      let sheetSettings = this.getSheetClassesSetting();

      // Evaluate each option.
      this.sheetOptions.forEach((o) => {
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
