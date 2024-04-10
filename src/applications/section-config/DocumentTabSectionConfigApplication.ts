import type { SvelteComponent } from 'svelte';
import SvelteFormApplicationBase from '../SvelteFormApplicationBase';
import DocumentTabSectionConfig from './DocumentTabSectionConfig.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { Actor5e } from 'src/types/types';
import { TidyFlags, type SectionConfig } from 'src/api';
import type { DocumentTabSectionConfigItem } from './section-config';

type SectionConfigConstructorArgs = {
  actor: Actor5e;
  sections: DocumentTabSectionConfigItem[];
  tabId: string;
  tabTitle: string;
};

export class DocumentTabSectionConfigApplication extends SvelteFormApplicationBase {
  actor: Actor5e;
  sections: DocumentTabSectionConfigItem[];
  tabId: string;
  tabTitle: string;

  constructor({
    actor,
    sections,
    tabId,
    tabTitle,
  }: SectionConfigConstructorArgs) {
    super();
    this.actor = actor;
    this.sections = sections;
    this.tabId = tabId;
    this.tabTitle = tabTitle;
  }

  static get defaultOptions() {
    return FoundryAdapter.mergeObject(super.defaultOptions, {
      width: 650,
      height: 500,
      id: 'tidy-5e-sheets-migration-selection',
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
        onConfirm: this._onConfirm.bind(this),
        useDefault: this._useDefault.bind(this),
      },
    });
  }

  private _onConfirm(sections: DocumentTabSectionConfigItem[]) {
    const sectionConfig = TidyFlags.sectionConfig.get(this.actor) ?? {};
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
    TidyFlags.sectionConfig.set(this.actor, sectionConfig);
    this.close();
  }

  private _useDefault() {
    Dialog.confirm({
      title: FoundryAdapter.localize('TIDY5E.UseDefaultDialog.title'),
      content: `<p>${FoundryAdapter.localize(
        'TIDY5E.UseDefaultDialog.text'
      )}</p>`,
      yes: () => {
        const sectionConfig = TidyFlags.sectionConfig.get(this.actor) ?? {};
        delete sectionConfig[this.tabId];
        sectionConfig[`-=${this.tabId}`] = {};
        TidyFlags.sectionConfig.set(this.actor, sectionConfig);
        this.close();
      },
      no: () => {},
      defaultYes: false,
    });
  }
}
