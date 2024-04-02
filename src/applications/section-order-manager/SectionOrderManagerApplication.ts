import type { SvelteComponent } from 'svelte';
import SvelteFormApplicationBase from '../SvelteFormApplicationBase';
import SectionOrderManager from './SectionOrderManager.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { Actor5e } from 'src/types/types';
import type { KeyedAndLabeled } from './section-order-manager.types';
import { TidyFlags } from 'src/api';

type SectionOrderManagerConstructorArgs = {
  actor: Actor5e;
  sections: KeyedAndLabeled[];
  tabId: string;
  tabTitle: string;
};

export class SectionOrderManagerApplication extends SvelteFormApplicationBase {
  actor: Actor5e;
  sections: KeyedAndLabeled[];
  tabId: string;
  tabTitle: string;

  constructor({
    actor,
    sections,
    tabId,
    tabTitle,
  }: SectionOrderManagerConstructorArgs) {
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
    return FoundryAdapter.localize('TIDY5E.Section.ManagerDialogTitle', {
      tabTitle: this.tabTitle,
    });
  }

  createComponent(node: HTMLElement): SvelteComponent<any, any, any> {
    return new SectionOrderManager({
      target: node,
      props: {
        sections: this.sections.map((s: KeyedAndLabeled) => ({
          key: s.key,
          label: FoundryAdapter.localize(s.label),
        })),
        onConfirm: this._onConfirm.bind(this),
        useDefault: this._useDefault.bind(this),
      },
    });
  }

  private _onConfirm(sections: KeyedAndLabeled[]) {
    const sectionOrder = TidyFlags.actorSectionOrder.get(this.actor) ?? {};
    sectionOrder[this.tabId] = sections.map((s) => s.key);
    TidyFlags.actorSectionOrder.set(this.actor, sectionOrder);
    this.close();
  }

  private _useDefault() {
    Dialog.confirm({
      title: FoundryAdapter.localize('TIDY5E.UseDefaultDialog.title'),
      content: `<p>${FoundryAdapter.localize(
        'TIDY5E.UseDefaultDialog.text'
      )}</p>`,
      yes: () => {
        const sectionOrder = TidyFlags.actorSectionOrder.get(this.actor) ?? {};
        delete sectionOrder[this.tabId];
        sectionOrder[`-=${this.tabId}`] = [];
        TidyFlags.actorSectionOrder.set(this.actor, sectionOrder);
        this.close();
      },
      no: () => {},
      defaultYes: false,
    });
  }
}
