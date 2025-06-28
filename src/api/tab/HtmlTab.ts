import type { OnRenderTabParams } from 'src/types/types';
import type { RenderScheme } from '../api.types';
import {
  CustomTabBase,
  type CustomTabTitle,
  type TabId,
} from './CustomTabBase';
import { warn } from 'src/utils/logging';

/**
 * The information necessary for rendering an HTML-based tab.
 * @example Getting the API and creating an HTML tab that wires an even on render
 * ```js
 * Hooks.once('tidy5e-sheet.ready', (api) => {
 *   const myTab = new api.models.HtmlTab({
 *     title: 'My Tab',
 *     tabId: "my-module-id-my-example-html-tab",
 *     html: `<button type="button" class="my-button">My button</button>`,
 *     onRender(params) {
 *       params.element
 *         .querySelector('.my-button')
 *         ?.addEventListener('click', () => {
 *           alert('clicked');
 *         });
 *     },
 *   });
 *   // To Do: Register this HTML-based tab!
 * });
 * ```
 * 
 * @example Using async `getData` to provide data for the html callback
 * Hooks.once('tidy5e-sheet.ready', (api) => {
 * const myTab = new api.models.HtmlTab({
 *   title: 'My Tab',
 *   tabId: "my-module-id-my-example-html-tab",
 *   html: (data) => `
 *     <h1>${data.title}</h1>
 *     <p>
 *         If you like authoring a string of HTML directly, 
 *         while having access to whatever data you need, 
 *         this is the option for you. Indeed, because 
 *         it is an async-friendly function, you can
 *         load external data from outside sources,
 *         like Google Sheets or an online database.
 *     </p>
 * `,
 *   async getData(context) {
 *     return {
 *         title: `Hello, ${context.document.name}!`,
 *         context
 *     }
 *   }
 * });
 *
 * api.registerActorTab(myTab, { layout: 'all' });
});
 */
/** @category Tabs */
export class HtmlTab extends CustomTabBase {
  title: CustomTabTitle = '';
  iconClass?: string | undefined;
  tabId: TabId = '';
  /**
   * A string of HTML or a function which returns HTML.
   * By default, the function will pass in the sheet context data for the relevant sheet which is being rendered.
   * If `getData` is used, then whatever `getData` returned will be provided here instead.
   */
  html: string | ((data: any) => string) = '';

  renderScheme: RenderScheme = 'handlebars';

  tabContentsClasses: string[] = [];

  constructor(props?: Partial<HtmlTab>) {
    super();

    const merged = foundry.utils.mergeObject(this, props);
    Object.assign(this, merged);
  }

  /**
   * An optional function that provides the relevant application context
   * (item sheet context, character sheet context, NPC sheet context, etc.)
   * and expects the same data or a replacement object in return.
   * The return value is passed to the HTML callback function, if the callback function is used.
   */
  getData?: (context: any) => any | Promise<any>;

  enabled?: (context: any) => boolean;

  onRender?: (params: OnRenderTabParams) => void;
}
