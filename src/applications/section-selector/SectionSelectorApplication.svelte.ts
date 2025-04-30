import { CONSTANTS } from 'src/constants';
import { SvelteApplicationMixin } from 'src/mixins/SvelteApplicationMixin.svelte';
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
import { settings } from 'src/settings/settings.svelte';

export type SectionSelectorContext = {
  sections: string[];
  currentSection: string | undefined;
  // TODO: Eliminate the need for this. It's not relevant for this application.
  tabs: Tab[];
};

export class SectionSelectorApplication extends SvelteApplicationMixin<
  Partial<ApplicationConfiguration> | undefined,
  SectionSelectorContext
>(foundry.applications.api.DocumentSheetV2) {
  _prop: string;
  _sectionType: string;

  constructor(
    flag: string,
    sectionType: string,
    options: DocumentSheetApplicationConfiguration
  ) {
    super(options);

    this._prop = flag;
    this._sectionType = sectionType;
  }

  static DEFAULT_OPTIONS: Partial<ApplicationConfiguration> = {
    classes: [
      CONSTANTS.MODULE_ID,
      'application',
      'sheet',
      'quadrone',
      'tidy-section-selector-application',
      'app-v2',
      'scrollable-window-content'
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

  _configureEffects(): void {
    $effect(() => {
      settings.value;

      this.render(true);
    });
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
    await this.document.update({
      [this._prop]: name,
    });
  }

  async useDefaultSection() {
    await this.document.update({
      [this._prop]: null,
    });
  }
}
