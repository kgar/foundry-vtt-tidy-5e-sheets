import { CONSTANTS } from 'src/constants';
import { SvelteApplicationMixin } from 'src/mixins/SvelteApplicationMixin.svelte';
import type { ThemeSettings } from 'src/theme/theme-quadrone.types';
import type { ApplicationConfiguration } from 'src/types/application.types';
import { mount } from 'svelte';
import ThemeSettingsQuadrone from './ThemeSettingsQuadrone.svelte';
import type { CoarseReactivityProvider } from 'src/features/reactivity/CoarseReactivityProvider.svelte';
import { TidyFlags } from 'src/api';
import { settings } from 'src/settings/settings.svelte';

export type ThemeSettingsContext = ThemeSettings;
type ConstructorArgs = Partial<ApplicationConfiguration & { document?: any }>;

export class ThemeSettingsQuadroneApplication extends SvelteApplicationMixin<
  ConstructorArgs,
  ThemeSettingsContext
>(foundry.applications.api.ApplicationV2) {
  _document?: any;

  constructor(options: ConstructorArgs = {}) {
    options.id = options?.document
      ? `tidy-theme-settings-${options.document.uuid}`
      : 'tidy-theme-settings';
    super(options);

    this._document = options.document;
  }

  static DEFAULT_OPTIONS: Partial<ConstructorArgs> = {
    classes: [CONSTANTS.MODULE_ID, 'sheet', 'quadrone', 'tidy-theme-settings'],
    tag: 'form',
    sheetConfig: false,
    window: {
      frame: true,
      positioned: true,
      resizable: true,
      controls: [],
      //   contentClasses: ['flexcol', 'flex1'],
    },
    position: {
      width: 600,
      height: 600,
    },
    actions: {},
    submitOnClose: false,
  };

  get title() {
    return this._document
      ? `(Localize) ${this._document.name}: Theme Settings`
      : '(Localize) World Theme Settings';
  }

  _createComponent(node: HTMLElement): Record<string, any> {
    const component = mount(ThemeSettingsQuadrone, {
      target: node,
      props: {
        app: this,
        settings: this
          ._context as CoarseReactivityProvider<ThemeSettingsContext>,
      },
    });

    return component;
  }

  async _prepareContext() {
    let themeSettings = structuredClone(
      this._document
        ? TidyFlags.sheetThemeSettings.get(this._document)
        : settings.value.worldThemeSettings
    );

    return themeSettings;
  }
}
