import type {
  CustomContentInjectParams,
  OnContentReadyParams,
  OnRenderParams,
  RenderScheme,
} from '../api.types';
import { CustomContentBase } from './CustomContentBase';

/** @category Content */
export class HtmlContent extends CustomContentBase {
  injectParams?: CustomContentInjectParams | undefined;
  /**
   * The HTML to be injected into the sheet.
   */
  html: string | ((data: any) => string) = '';
  renderScheme: RenderScheme = 'handlebars';

  constructor(props?: Partial<HtmlContent>) {
    super();

    const merged = foundry.utils.mergeObject(this, props);
    Object.assign(this, merged);
  }

  onContentReady?: (params: OnContentReadyParams) => void;

  enabled?: (context: any) => boolean;

  onRender?: (params: OnRenderParams) => void;
}
