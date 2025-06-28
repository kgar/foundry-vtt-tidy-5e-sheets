import { mount } from 'svelte';
import DocumentTabSectionConfig from './DocumentTabSectionConfig.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { TidySectionBase } from 'src/types/types';
import type { DocumentTabSectionConfigItem } from './section-config.types';
import { TidyFlags } from 'src/foundry/TidyFlags';
import type { SectionConfig } from 'src/features/sections/sections.types';
import type { DocumentSheetApplicationConfiguration } from 'src/types/application.types';
import { CONSTANTS } from 'src/constants';
import { DocumentSheetDialog } from 'src/applications-quadrone/DocumentSheetDialog.svelte';

type SectionConfigConstructorArgs = {
  sections: TidySectionBase[];
  tabId: string;
  tabTitle: string;
};

export class DocumentTabSectionConfigApplication extends DocumentSheetDialog<
  DocumentSheetApplicationConfiguration,
  {}
>() {
  sections = $state<DocumentTabSectionConfigItem[]>()!;
  tabId: string;
  tabTitle: string;

  static DEFAULT_OPTIONS = {
    classes: [
      CONSTANTS.MODULE_ID,
      'application-shell',
      'tidy-5e-sheets-section-configuration',
      CONSTANTS.SHEET_LAYOUT_CLASSIC,
    ],
    sheetConfig: false,
    window: {
      frame: true,
      positioned: true,
      resizable: true,
      controls: [],
    },
    position: {
      height: 650,
      width: 500,
    },
    actions: {},
  };

  constructor(
    { sections, tabId, tabTitle }: SectionConfigConstructorArgs,
    config: DocumentSheetApplicationConfiguration
  ) {
    super(config);
    this.sections = sections.map((section) => ({
      key: section.key,
      label: FoundryAdapter.localize(section.label),
      show: section.show !== false,
    }));
    this.tabId = tabId;
    this.tabTitle = tabTitle;
  }

  get title() {
    return FoundryAdapter.localize('TIDY5E.Section.ConfigDialog.title', {
      tabTitle: this.tabTitle,
    });
  }

  _createComponent(node: HTMLElement): Record<string, any> {
    return mount(DocumentTabSectionConfig, {
      target: node,
      props: {
        sections: this.sections,
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

  private async _useDefault() {
    const proceed = await foundry.applications.api.DialogV2.confirm({
      window: {
        title: FoundryAdapter.localize('TIDY5E.UseDefaultDialog.title'),
      },
      content: `<p>${FoundryAdapter.localize(
        'TIDY5E.UseDefaultDialog.text'
      )}</p>`,
    });

    if (!proceed) {
      return;
    }

    const sectionConfig = TidyFlags.sectionConfig.get(this.document) ?? {};
    delete sectionConfig[this.tabId];
    // TODO: Figure out how to do this in a less suppressing way.
    //@ts-expect-error
    sectionConfig[`-=${this.tabId}`] = null;
    await this.document.update({
      [TidyFlags.sectionConfig.prop]: sectionConfig,
    });
    await this.close();
  }
}
