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
 */
/** @category Tabs */
export class HtmlTab extends CustomTabBase {
  title: CustomTabTitle = '';
  iconClass?: string | undefined;
  tabId: TabId = '';
  html: string = '';
  renderScheme: RenderScheme = 'handlebars';
  tabContentsClasses: string[] = [];

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

  constructor(props?: Partial<HtmlTab>) {
    super();

    const merged = foundry.utils.mergeObject(this, props);
    Object.assign(this, merged);
  }

  enabled?: (context: any) => boolean;

  onRender?: (params: OnRenderTabParams) => void;
}
