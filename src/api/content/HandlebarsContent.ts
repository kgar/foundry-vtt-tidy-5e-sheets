import type { OnRenderParams, RenderScheme } from '../api.types';

export class HandlebarsContent {
  /**
   * The path to the handlebars template. Use a leading slash to look in the UserData directory.
   * @example A template in a module's templates directory
   * ```"/modules/my-module-id/templates/my-module-template.hbs"```
   */
  path: string = '';
  renderScheme: RenderScheme = 'handlebars';
  activateDefaultSheetListeners?: boolean | undefined;

  /**
   * An optional function that provides the relevant application context
   * (item sheet context, character sheet context, NPC sheet context, etc.)
   * and expects the same data or a replacement object in return.
   * The return value is passed to the Handlebars template.
   */
  getData?: (context: any) => any | Promise<any>;

  /**
   * Optional function to determine whether the content should be rendered. When excluded, it defaults to `true`.
   * The `context` field is the relevant application context (item sheet, character sheet, etc.).
   */
  enabled?: (context: any) => boolean;

  /**
   * Optional function which is called each time a change detection cycle occurs on the sheet.
   * It is called after this content is optionally re-rendered to the DOM.
   */
  onRender?: (params: OnRenderParams) => void;
}
