import type { SvelteComponent } from 'svelte';
import SvelteFormApplicationBase from '../SvelteFormApplicationBase';
import SectionConfig from './SectionConfig.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { Actor5e } from 'src/types/types';
import type { SectionConfigItem } from './section-config.types';
import { TidyFlags } from 'src/api';

type SectionConfigConstructorArgs = {
  actor: Actor5e;
  sections: SectionConfigItem[];
  tabId: string;
  tabTitle: string;
};

export class SectionConfigApplication extends SvelteFormApplicationBase {
  actor: Actor5e;
  sections: SectionConfigItem[];
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
    return new SectionConfig({
      target: node,
      props: {
        sections: this.sections.map((s: SectionConfigItem) => ({
          key: s.key,
          label: FoundryAdapter.localize(s.label),
          show: s.show,
        })),
        onConfirm: this._onConfirm.bind(this),
        useDefault: this._useDefault.bind(this),
      },
    });
  }

  private _onConfirm(sections: SectionConfigItem[]) {
    const sectionConfig = TidyFlags.sectionConfig.get(this.actor) ?? {};
    sectionConfig[this.tabId] = sections.map((s, i) => ({
      key: s.key,
      order: i,
      show: s.show !== false,
    }));
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
        sectionConfig[`-=${this.tabId}`] = [];
        TidyFlags.sectionConfig.set(this.actor, sectionConfig);
        this.close();
      },
      no: () => {},
      defaultYes: false,
    });
  }
}
