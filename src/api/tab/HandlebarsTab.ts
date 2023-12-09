import type { OnRenderArgs, RenderScheme } from '../api.types';
import { CustomTabBase } from './TabBase';

export class HandlebarsTab extends CustomTabBase {
  title: string = '';
  tabId: string = '';
  path: string = '';
  renderScheme: RenderScheme = 'handlebars';
  tabContentsClasses: string[] = [];

  constructor(props?: Partial<HandlebarsTab>) {
    super();

    const merged = mergeObject(this, props);
    Object.assign(this, merged);
  }

  getData?: (context: any) => any | Promise<any>;

  enabled?: (context: any) => boolean;

  onRender?: (args: OnRenderArgs & { tabContentsElement: HTMLElement }) => void;
}
