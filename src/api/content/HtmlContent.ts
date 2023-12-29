import type { CustomContentHtmlInsertParams, OnRenderParams, RenderScheme } from '../api.types';
import { CustomContentBase } from './CustomContentBase';

export class HtmlContent extends CustomContentBase {
  htmlInsertParams?: CustomContentHtmlInsertParams | undefined;
  /**
   * The HTML to be injected into the sheet.
   */
  html: string = '';
  renderScheme: RenderScheme = 'handlebars';
  activateDefaultSheetListeners?: boolean | undefined = false;
  
  constructor(props?: Partial<HtmlContent>) {
    super();
    
    const merged = mergeObject(this, props);
    Object.assign(this, merged);
  }
  
  onContentReady?: (() => void) | undefined;

  enabled?: (context: any) => boolean;

  onRender?: (params: OnRenderParams) => void;
}
