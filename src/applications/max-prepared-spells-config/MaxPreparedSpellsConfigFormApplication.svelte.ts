import { mount } from 'svelte';
import MaxPreparedSpellsConfig from './MaxPreparedSpellsConfig.svelte';
import type { MaxPreparedSpellFormula } from 'src/types/types';
import type { Item5e } from 'src/types/item.types';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { getMaxPreparedSpellsSampleFormulas } from 'src/utils/formula';
import type { DocumentSheetApplicationConfiguration } from 'src/types/application.types';
import { CONSTANTS } from 'src/constants';
import { DocumentSheetDialog } from 'src/applications-quadrone/DocumentSheetDialog.svelte';

export type MaxPreparedSpellsConfigContext = {
  maxPreparedSpells: string;
  formulas: MaxPreparedSpellFormula[];
};

export class MaxPreparedSpellsConfigFormApplication extends DocumentSheetDialog<
  DocumentSheetApplicationConfiguration,
  MaxPreparedSpellsConfigContext
>() {
  classToUpdate: Item5e;

  static DEFAULT_OPTIONS: Partial<DocumentSheetApplicationConfiguration> = {
    classes: [
      CONSTANTS.MODULE_ID,
      'application-shell',
      CONSTANTS.SHEET_LAYOUT_CLASSIC,
    ],
    sheetConfig: false,
    position: {
      width: 500,
      height: 'auto',
    },
  };

  constructor(
    documentName: string,
    classToUpdate: Item5e,
    config: DocumentSheetApplicationConfiguration
  ) {
    super(config);
    this.documentName = documentName;
    this.classToUpdate = classToUpdate;
  }

  _createComponent(node: HTMLElement): Record<string, any> {
    return mount(MaxPreparedSpellsConfig, {
      target: node,
      context: new Map<any, any>([
        ['context', this._context],
        ['appId', this.appId],
        ['save', this._save.bind(this)],
      ]),
    });
  }

  async _prepareContext(): Promise<MaxPreparedSpellsConfigContext> {
    return {
      maxPreparedSpells:
        this.classToUpdate?.system?.spellcasting?.preparation?.formula ?? '',
      formulas: getMaxPreparedSpellsSampleFormulas(),
    };
  }

  get title() {
    return FoundryAdapter.localize('TIDY5E.MaxPreparedSpellsConfig.Title', {
      documentName: this.documentName,
    });
  }

  async _save(): Promise<void> {
    await this.classToUpdate.update({
      'system.spellcasting.preparation.formula':
        this._context.data?.maxPreparedSpells ?? '',
    });
    this.close();
  }
}
