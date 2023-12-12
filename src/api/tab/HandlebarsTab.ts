import type { OnRenderTabArgs } from 'src/types/types';
import type { RenderScheme } from '../api.types';
import { CustomTabBase } from './CustomTabBase';

/**
 * The information necessary for rendering a handlebars-based tab.
 * @example Getting the API and creating a Handlebars tab
 * ```js
 * Hooks.once('tidy5e-sheet.ready', (api) => {
 *   const myTab = new api.models.HandlebarsTab({
 *     title: 'My Item Tab',
 *     path: '/modules/my-module/my-item-tab.hbs',
 *     enabled: (data) => data.item.type === 'spell',
 *     getData: (data) => {
 *       data['my-extra-data'] = 'Hello, world! 👋';
 *       return data;
 *     },
 *   });
 *   // To Do: Register this tab!
 * });
 * ```
 */
export class HandlebarsTab extends CustomTabBase {
  title: string = '';
  tabId: string = '';
  /**
   * The path to the handlebars template. Use a leading slash to look in the UserData directory.
   * @example A template in a module's templates directory
   * ```"/modules/my-module/templates/my-module-template.hbs"```
   */
  path: string = '';
  renderScheme: RenderScheme = 'handlebars';
  tabContentsClasses: string[] = [];

  constructor(props?: Partial<HandlebarsTab>) {
    super();

    const merged = mergeObject(this, props);
    Object.assign(this, merged);
  }

  /**
   * An optional function that provides the relevant application context
   * (item sheet context, character sheet context, NPC sheet context, etc.)
   * and expects the same data or a replacement object in return.
   * The return value is passed to the Handlebars template.
   */
  getData?: (context: any) => any | Promise<any>;

  /**
   * Optional function to determine whether the tab should be visible when viewing the sheet. When excluded, it defaults to `true`.
   * The `context` field is the relevant application context (item sheet, character sheet, etc.).
   */
  enabled?: (context: any) => boolean;

  /**
   * Optional function which is called each time a change detection cycle occurs on the sheet.
   * It is called after this tab's content is optionally re-rendered to the DOM.
   */
  onRender?: (args: OnRenderTabArgs) => void;
}
