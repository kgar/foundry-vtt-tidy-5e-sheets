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

export class SectionSelectorApplication extends SvelteApplicationMixin<{}>(
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
      width: 400,
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

  async _renderHTML(context: {}, options: ApplicationRenderOptions) {
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
    return {};
  }

  async selectSection(name: string) {
    await this._document.update({
      [this._prop]: name,
    });
  }
}
