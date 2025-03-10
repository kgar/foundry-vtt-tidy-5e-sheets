import { CONSTANTS } from 'src/constants';
import { SvelteApplicationMixin } from 'src/mixins/SvelteApplicationMixin.svelte';
import type {
  ApplicationConfiguration,
  ApplicationRenderOptions,
} from 'src/types/application.types';
import { mount } from 'svelte';
import ConfigureSections from './ConfigureSections.svelte';
import type { TidySectionBase } from 'src/types/types';
import type { ConfigurableSection } from './configure-sections.types';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { getDocumentTheme } from 'src/theme/theme';

export type ConfigureSectionsApplicationConstructorArgs = {
  settings: {
    sections: TidySectionBase[];
    tabId: string;
  };
} & Partial<ApplicationConfiguration>;

export class ConfigureSectionsApplication extends SvelteApplicationMixin<any>(
  foundry.applications.api.DocumentSheetV2
) {
  sections = $state<ConfigurableSection[]>()!;
  tabId: string;
  theme: string = $state<string>('');

  constructor({
    settings: { sections, tabId },
    ...rest
  }: ConfigureSectionsApplicationConstructorArgs) {
    super(rest);
    this.sections = sections.map((section) => ({
      key: section.key,
      label: FoundryAdapter.localize(section.label),
      show: section.show !== false,
    }));
    this.tabId = tabId;
    this.theme = getDocumentTheme(rest.document);
  }

  static DEFAULT_OPTIONS: Partial<
    ApplicationConfiguration & { dragDrop: Partial<DragDropConfiguration>[] }
  > = {
    classes: [CONSTANTS.MODULE_ID, 'app-v2', 'quadrone', 'options-dialog'],
    tag: 'div',
    sheetConfig: false,
    window: {
      frame: true,
      positioned: true,
      resizable: true,
      controls: [],
    },
    position: {
      width: 550,
      height: 600,
    },
    actions: {},
    submitOnClose: false,
  };

  _createComponent(node: HTMLElement): Record<string, any> {
    const context = new Map<any, any>([]);

    const component = mount(ConfigureSections, {
      target: node,
      context: context,
      props: {
        sections: this.sections,
        application: this,
      },
    });

    return component;
  }

  _configureEffects(): void {
    $effect(() => {
      // remove all other theme-{name} classes
      const element = this.element as HTMLElement;
      // TODO: Use a fixed list of known themes, possibly from Foundry itself?
      const toRemove = Array.from(element.classList).filter((value: string) =>
        value.startsWith('theme-')
      );
      toRemove.forEach((classToRemove) =>
        element.classList.remove(classToRemove)
      );

      // add my theme-{name} class to element
      element.classList.toggle('themed', true);
      element.classList.toggle(`theme-${this.theme}`, true);
    });
  }

  async _prepareContext(options: ApplicationRenderOptions): Promise<any> {
    return {};
  }

  /* -------------------------------------------- */

  /** @override */
  _onClose(..._: any[]) {}

  /* -------------------------------------------- */

  /** @override */
  _onFirstRender(..._: any[]) {}

  /* -------------------------------------------- */
}
