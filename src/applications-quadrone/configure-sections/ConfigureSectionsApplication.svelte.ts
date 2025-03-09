import { CONSTANTS } from 'src/constants';
import { SvelteApplicationMixin } from 'src/mixins/SvelteApplicationMixin.svelte';
import type {
  ApplicationConfiguration,
  ApplicationRenderOptions,
} from 'src/types/application.types';
import { mount } from 'svelte';
import ConfigureSections from './ConfigureSections.svelte';

export class ConfigureSectionsApplication extends SvelteApplicationMixin<any>(
  foundry.applications.api.ApplicationV2
) {
  static DEFAULT_OPTIONS: Partial<
    ApplicationConfiguration & { dragDrop: Partial<DragDropConfiguration>[] }
  > = {
    classes: [CONSTANTS.MODULE_ID, 'app-v2', 'quadrone'],
    tag: 'div',
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
    });

    const html = globalThis.$(this.element);

    return component;
  }

  async _prepareContext(options: ApplicationRenderOptions): Promise<any> {
    return {};
  }
}
