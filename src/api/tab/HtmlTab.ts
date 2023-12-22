import type { OnRenderTabParams } from 'src/types/types';
import type { RenderScheme } from '../api.types';
import {
  CustomTabBase,
  type CustomTabTitle,
  type TabId,
} from './CustomTabBase';

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
 */
export class HtmlTab extends CustomTabBase {
  title: CustomTabTitle = '';
  tabId: TabId = '';
  html: string = '';
  renderScheme: RenderScheme = 'handlebars';
  tabContentsClasses: string[] = [];
  activateDefaultSheetListeners?: boolean | undefined;

  constructor(props?: Partial<HtmlTab>) {
    super();

    this.activateDefaultSheetListeners = true;
    const merged = mergeObject(this, props);
    Object.assign(this, merged);
  }

  enabled?: (context: any) => boolean;

  onRender?: (params: OnRenderTabParams) => void;
}
