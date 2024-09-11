import { warn } from 'src/utils/logging';
import type {
  CustomContentInjectParams,
  OnContentReadyParams,
  OnRenderParams,
  RenderScheme,
} from '../api.types';
import { CustomContentBase } from './CustomContentBase';

/** @category Content */
export class HandlebarsContent extends CustomContentBase {
  injectParams?: CustomContentInjectParams | undefined;
  /**
   * The path to the handlebars template. Use a leading slash to look in the UserData directory.
   * @example A template in a module's templates directory
   * ```"/modules/my-module-id/templates/my-module-template.hbs"```
   */
  path: string = '';
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

  constructor(props?: Partial<HandlebarsContent>) {
    super();

    const merged = foundry.utils.mergeObject(this, props);
    Object.assign(this, merged);
  }

  onContentReady?: (params: OnContentReadyParams) => void;

  /**
   * An optional function that provides the relevant application context
   * (item sheet context, character sheet context, NPC sheet context, etc.)
   * and expects the same data or a replacement object in return.
   * The return value is passed to the Handlebars template.
   */
  getData?: (context: any) => any | Promise<any>;

  enabled?: (context: any) => boolean;

  onRender?: (params: OnRenderParams) => void;
}
