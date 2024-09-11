import { warn } from 'src/utils/logging';
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
  
  private _activateDefaultSheetListeners?: boolean | undefined = false;
  public get activateDefaultSheetListeners(): boolean | undefined {
    return this._activateDefaultSheetListeners;
  }
  public set activateDefaultSheetListeners(value: boolean | undefined) {
    warn(
      'Tidy is moving to Application V2, and there will no longer be any default sheet listeners. Be sure to provide your own event handling for the content that is injected.'
    );
    this._activateDefaultSheetListeners = value;
  }

  constructor(props?: Partial<HtmlContent>) {
    super();

    const merged = foundry.utils.mergeObject(this, props);
    Object.assign(this, merged);
  }

  onContentReady?: (params: OnContentReadyParams) => void;

  enabled?: (context: any) => boolean;

  onRender?: (params: OnRenderParams) => void;
}
