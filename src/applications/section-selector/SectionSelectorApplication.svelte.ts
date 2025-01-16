import { CONSTANTS } from 'src/constants';
import { SvelteApplicationMixin } from 'src/mixins/SvelteApplicationMixin.svelte';
import type {
  ApplicationClosingOptions,
  ApplicationConfiguration,
  ApplicationRenderOptions,
} from 'src/types/application.types';
import { mount } from 'svelte';
import SectionSelector from './SectionSelector.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { Tab } from 'src/types/types';
import { SheetSections } from 'src/features/sections/SheetSections';

export type SectionSelectorContext = {
  sections: string[];
  currentSection: string | undefined;
  // TODO: Eliminate the need for this. It's not relevant for this application.
  tabs: Tab[];
};

export class SectionSelectorApplication extends SvelteApplicationMixin<SectionSelectorContext>(
  foundry.applications.api.ApplicationV2
) {
  _document: any;
  _prop: string;
  _sectionType: string;

  constructor(
    document: any,
    flag: string,
    sectionType: string,
    ...rest: any[]
  ) {
    super(...rest);
    this._document = document;
    this._prop = flag;
    this._sectionType = sectionType;
  }

  static DEFAULT_OPTIONS: Partial<ApplicationConfiguration> = {
    classes: [
      CONSTANTS.MODULE_ID,
      'application',
      'sheet',
      'dnd5e2',
      'standard-form',
      'config-sheet',
      'tidy-section-selector-application',
      'app-v2',
    ],
    tag: 'div',
    window: {
      frame: true,
      positioned: true,
      resizable: true,
      controls: [],
    },
    position: {
      width: 600,
      height: 600,
    },
    actions: {},
    submitOnClose: false,
  };

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
      documentName: this._document.name,
    });
  }

  async _renderHTML(
    context: SectionSelectorContext,
    options: ApplicationRenderOptions
  ) {
    game.user.apps[this.id] = this;
    this._document.apps[this.id] = this;

    return await super._renderHTML(context, options);
  }

  async close(options: ApplicationClosingOptions = {}) {
    delete game.user.apps[this.id];
    delete this._document.apps[this.id];

    return await super.close(options);
  }

  async _prepareContext() {
    const sections = SheetSections.getKnownCustomSections(this._document);
    const currentSection = FoundryAdapter.getProperty<string>(
      this._document,
      this._prop
    );

    return {
      sections,
      currentSection,
      tabs: [],
    };
  }

  async selectSection(name: string) {
    await this._document.update({
      [this._prop]: name,
    });
  }

  async useDefaultSection() {
    await this._document.update({
      [this._prop]: null,
    });
  }
}
