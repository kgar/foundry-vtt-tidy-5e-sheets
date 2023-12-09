import type { OnRenderArgs } from '../api.types';
import { CustomTabBase } from './TabBase';

export class HtmlTab extends CustomTabBase {
  title: string = '';
  tabId: string = '';
  html: string = '';
  renderScheme: 'handlebars' | 'none' = 'handlebars';
  tabContentsClasses: string[] = [];

  constructor(props?: Partial<HtmlTab>) {
    super();

    const merged = mergeObject(this, props);
    Object.assign(this, merged);
  }

  enabled?: (context: any) => boolean;

  onRender?: (args: OnRenderArgs & { tabContentsElement: HTMLElement }) => void;
}
