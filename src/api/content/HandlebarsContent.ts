import type {
  CustomContentHtmlInsertParams,
  OnRenderParams,
  RenderScheme,
} from '../api.types';
import { CustomContentBase } from './CustomContentBase';

export class HandlebarsContent extends CustomContentBase {
  htmlInsertParams?: CustomContentHtmlInsertParams | undefined;
  /**
   * The path to the handlebars template. Use a leading slash to look in the UserData directory.
   * @example A template in a module's templates directory
   * ```"/modules/my-module-id/templates/my-module-template.hbs"```
   */
  path: string = '';
  renderScheme: RenderScheme = 'handlebars';
  activateDefaultSheetListeners?: boolean | undefined = false;

  constructor(props?: Partial<HandlebarsContent>) {
    super();

    const merged = mergeObject(this, props);
    Object.assign(this, merged);
  }

  onContentReady?: (() => void) | undefined;

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
