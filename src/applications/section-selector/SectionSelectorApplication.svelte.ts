import { CONSTANTS } from 'src/constants';
import type {
  ApplicationClosingOptions,
  ApplicationConfiguration,
  ApplicationRenderOptions,
  DocumentSheetApplicationConfiguration,
} from 'src/types/application.types';
import { mount } from 'svelte';
import SectionSelector from './SectionSelector.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { Tab } from 'src/types/types';
import { SheetSections } from 'src/features/sections/SheetSections';
import { DocumentSheetDialog } from 'src/applications-quadrone/DocumentSheetDialog.svelte';
import type { ThemeSettingsConfigurationOptions } from 'src/theme/theme-quadrone.types';

export type SectionSelectorContext = {
  sections: string[];
  currentSection: string | undefined;
  // TODO: Eliminate the need for this. It's not relevant for this application.
  tabs: Tab[];
};

export type SectionSelectorApplicationConfiguration =
  DocumentSheetApplicationConfiguration & {
    flag: string;
    sectionType: string;
    callingDocument: any;
    onSave?: (section: string | null) => Promise<any>;
  };

export class SectionSelectorApplication extends DocumentSheetDialog<
  DocumentSheetApplicationConfiguration,
  SectionSelectorContext
>() {
  /**
   * The property on the document to check for the current section and to save changes.
   */
  _prop: string;
  /**
   * A label to clarify the type of section being set. E.g., an Action Section.
   */
  _sectionType: string;
  /**
   * The document that requested this application, not necessarily the document
   * to be edited. This is used to determine the theme of this application.
   */
  _callingDocument: any;
  /**
   * Optional save override for scenarios where the section affiliation is being handled differently.
   */
  _onSave?: (section: string | null) => Promise<any>;

  constructor({
    flag,
    sectionType,
    callingDocument,
    onSave,
    ...options
  }: SectionSelectorApplicationConfiguration) {
    super(options);

    this._prop = flag;
    this._sectionType = sectionType;
    this._callingDocument = callingDocument;
    this._onSave = onSave;
  }

  static DEFAULT_OPTIONS: Partial<ApplicationConfiguration> = {
    classes: [
      CONSTANTS.MODULE_ID,
      'sheet',
      'quadrone',
      'tidy-section-selector-application',
      'scrollable-window-content',
    ],
    id: 'tidy-section-selector-application-{id}',
    tag: 'div',
    sheetConfig: false,
    window: {
      frame: true,
      positioned: true,
      resizable: true,
      controls: [],
    },
    position: {
      width: 400,
      height: 600,
    },
    actions: {},
    submitOnClose: false,
  };

  themeConfigOptions(): ThemeSettingsConfigurationOptions {
    return {
      doc: this._callingDocument,
      idOverride: this.id,
    };
  }

  _createComponent(node: HTMLElement): Record<string, any> {
    const component = mount(SectionSelector, {
      target: node,
      props: {
        sheet: this,
        context: this._context,
      },
    });

    return component;
  }

  get title() {
    return FoundryAdapter.localize('TIDY5E.Section.SectionSelectorTitle', {
      sectionType: this._sectionType,
      documentName: this.document.name,
    });
  }

  async _renderHTML(
    context: SectionSelectorContext,
    options: ApplicationRenderOptions
  ) {
    game.user.apps[this.id] = this;
    this.document.apps[this.id] = this;

    return await super._renderHTML(context, options);
  }

  async close(options: ApplicationClosingOptions = {}) {
    delete game.user.apps[this.id];
    delete this.document.apps[this.id];

    return await super.close(options);
  }

  async _prepareContext() {
    const sections = SheetSections.getKnownCustomSections(this.document);

    const currentSection = FoundryAdapter.getProperty<string>(
      this.document,
      this._prop
    );

    return {
      sections,
      currentSection,
      tabs: [],
    };
  }

  async selectSection(name: string) {
    if (this._onSave) {
      await this._onSave(name);
      return;
    }

    await this.document.update({
      [this._prop]: name,
    });
  }

  async useDefaultSection() {
    if (this._onSave) {
      await this._onSave(null);
      return;
    }

    await this.document.update({
      [this._prop]: null,
    });
  }
}
