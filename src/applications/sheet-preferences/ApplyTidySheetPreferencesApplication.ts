import type { SvelteComponent } from 'svelte';
import SvelteFormApplicationBase from '../SvelteFormApplicationBase';
import ApplyTidySheetPreferences from './ApplyTidySheetPreferences.svelte';
import { writable } from 'svelte/store';

export type SheetPreferenceOption = {
  label: string;
  identifier: string;
  settingKey: string;
  selected: boolean;
};

export class ApplyTidySheetPreferencesApplication extends SvelteFormApplicationBase {
  createComponent(node: HTMLElement): SvelteComponent<any, any, any> {
    return new ApplyTidySheetPreferences({
      target: node,
      props: {
        options:
          ApplyTidySheetPreferencesApplication.getTidySheetPreferenceOptions(),
      },
    });
  }

  static getTidySheetPreferenceOptions() {
    const types: SheetPreferenceOption[] = [];
    for (const cls of Object.values<any>(foundry.documents)) {
      const documentName = cls.documentName;
      if (!cls.hasTypeData) continue;
      const subTypes = game.documentTypes[documentName].filter(
        (t: any) => t !== CONST.BASE_DOCUMENT_TYPE
      );
      if (!subTypes.length) continue;
      const title = game.i18n.localize(cls.metadata.labelPlural);
      subTypes.forEach((t: any) => {
        const typeLabel = CONFIG[documentName].typeLabels?.[t];
        const name = typeLabel ? game.i18n.localize(typeLabel) : t;
        const { defaultClasses, defaultClass } =
          DocumentSheetConfig.getSheetClassesForSubType(documentName, t);
        console.log({ type: t, name, defaultClasses, defaultClass });
      });
    }
    return [];
  }

  static applyPreferences(options: SheetPreferenceOption[]) {}
}
