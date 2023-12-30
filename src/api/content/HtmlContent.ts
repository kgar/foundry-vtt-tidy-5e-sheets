import type {
  CustomContentInjectParams,
  OnContentReadyParams,
  OnRenderParams,
  RenderScheme,
} from '../api.types';
import { CustomContentBase } from './CustomContentBase';

export class HtmlContent extends CustomContentBase {
  injectParams?: CustomContentInjectParams | undefined;
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

  onContentReady?: (params: OnContentReadyParams) => void;

  enabled?: (context: any) => boolean;

  onRender?: (params: OnRenderParams) => void;
}
