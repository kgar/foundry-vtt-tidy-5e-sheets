import type { ComponentType } from 'svelte';
import type { OnRenderTabArgs } from '..';
import type { RenderScheme } from '../api.types';
import { CustomTabBase, type CustomTabTitle } from './CustomTabBase';

export class SvelteTab extends CustomTabBase {
  component?: ComponentType = undefined;
  title: CustomTabTitle = '';
  tabId: string = '';
  renderScheme?: RenderScheme = 'force';
  tabContentsClasses?: string[] = [];
  activateDefaultSheetListeners?: boolean | undefined = false;

  constructor(props?: Partial<SvelteTab>) {
    super();

    const merged = mergeObject(this, props);
    Object.assign(this, merged);
  }

  getProps?: (data: any) => Record<string, any>;

  getContext?: (context: Map<any, any>) => Map<any, any>;

  enabled?: (data: any) => boolean;

  onRender?: (args: OnRenderTabArgs) => void;
}
