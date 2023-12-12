import type { OnRenderTabArgs } from 'src/types/types';
import type { RenderScheme } from '../api.types';
import { CustomTabBase } from './CustomTabBase';

export class HtmlTab extends CustomTabBase {
  title: string = '';
  tabId: string = '';
  html: string = '';
  renderScheme: RenderScheme = 'handlebars';
  tabContentsClasses: string[] = [];

  constructor(props?: Partial<HtmlTab>) {
    super();

    const merged = mergeObject(this, props);
    Object.assign(this, merged);
  }

  enabled?: (context: any) => boolean;

  onRender?: (args: OnRenderTabArgs) => void;
}
