import type { OnRenderParams, RenderScheme } from '../api.types';

export class HtmlContent {
  html: string = '';
  renderScheme: RenderScheme = 'handlebars';
  activateDefaultSheetListeners?: boolean | undefined = false;

  constructor(props?: Partial<HtmlContent>) {
    // TODO: Extract the base class
    // super();

    const merged = mergeObject(this, props);
    Object.assign(this, merged);
  }

  enabled?: (context: any) => boolean;

  onRender?: (params: OnRenderParams) => void;
}
