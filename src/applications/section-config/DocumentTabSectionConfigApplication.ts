import type { SvelteComponent } from 'svelte';
import SvelteFormApplicationBase from '../SvelteFormApplicationBase';
import DocumentTabSectionConfig from './DocumentTabSectionConfig.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { Actor5e, TidySectionBase } from 'src/types/types';
import type { DocumentTabSectionConfigItem } from './section-config.types';
import type { Item5e } from 'src/types/item.types';
import { TidyFlags } from 'src/foundry/TidyFlags';
import type { SectionConfig } from 'src/features/sections/sections.types';

type SectionConfigConstructorArgs = {
  document: Actor5e | Item5e;
  sections: TidySectionBase[];
  tabId: string;
  tabTitle: string;
};

export class DocumentTabSectionConfigApplication extends SvelteFormApplicationBase {
  document: Actor5e | Item5e;
  sections: DocumentTabSectionConfigItem[];
  tabId: string;
  tabTitle: string;

  constructor({
    document,
    sections,
    tabId,
    tabTitle,
  }: SectionConfigConstructorArgs) {
    super();
    this.document = document;
    this.sections = sections.map((section) => ({
      key: section.key,
      label: section.label,
      show: section.show !== false,
    }));
    this.tabId = tabId;
    this.tabTitle = tabTitle;
  }

  static get defaultOptions() {
    return FoundryAdapter.mergeObject(super.defaultOptions, {
      width: 650,
      height: 500,
      id: 'tidy-5e-sheets-section-configuration',
      popOut: true,
    });
  }

  get title() {
    return FoundryAdapter.localize('TIDY5E.Section.ConfigDialog.title', {
      tabTitle: this.tabTitle,
    });
  }

  createComponent(node: HTMLElement): SvelteComponent<any, any, any> {
    return new DocumentTabSectionConfig({
      target: node,
      props: {
        sections: this.sections.map((curr: DocumentTabSectionConfigItem) => {
          return {
            key: curr.key,
            label: FoundryAdapter.localize(curr.label),
            show: curr.show,
          };
        }, {}),
        onSaveChanges: this._onSaveChanges.bind(this),
        onApply: this._onApply.bind(this),
        useDefault: this._useDefault.bind(this),
      },
    });
  }

  private async _onSaveChanges(sections: DocumentTabSectionConfigItem[]) {
    await this._onApply(sections);
    this.close();
  }

  private async _onApply(sections: DocumentTabSectionConfigItem[]) {
    const sectionConfig = TidyFlags.sectionConfig.get(this.document) ?? {};
    sectionConfig[this.tabId] = sections.reduce<Record<string, SectionConfig>>(
      (result, curr, i) => {
        result[curr.key] = {
          key: curr.key,
          order: i,
          show: curr.show !== false,
        };
        return result;
      },
      {}
    );
    await TidyFlags.sectionConfig.set(this.document, sectionConfig);
  }

  private _useDefault() {
    Dialog.confirm({
      title: FoundryAdapter.localize('TIDY5E.UseDefaultDialog.title'),
      content: `<p>${FoundryAdapter.localize(
        'TIDY5E.UseDefaultDialog.text'
      )}</p>`,
      yes: () => {
        const sectionConfig = TidyFlags.sectionConfig.get(this.document) ?? {};
        delete sectionConfig[this.tabId];
        sectionConfig[`-=${this.tabId}`] = {};
        TidyFlags.sectionConfig.set(this.document, sectionConfig);
        this.close();
      },
      no: () => {},
      defaultYes: false,
    });
  }
}
