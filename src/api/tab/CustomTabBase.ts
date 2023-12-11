import type { OnRenderArgs, RenderScheme } from '../api.types';

/**
 * The basis of all custom registered tabs.
 */
export abstract class CustomTabBase {
  /**
   * The title to display on the tab. Accepts localization keys and plain text.
   */
  abstract title: string;

  /**
   * The static ID associated with the tab. It is used by Tidy 5e Sheets to enable tab selection.<br />
   *
   * **Note**: Use the same ID for your target tab every time.
   *  For example, try an ID like "my-module-ID-my-tab-title".
   *  Alternatively, you can generate a static ID using `foundry.utils.randomID()`
   *  and use that generated ID as your tab ID. The most important thing is to ensure
   *  it stays the same every time it is registered on page load.
   */
  abstract tabId: string;

  /**
   * Optionally determines whether to refresh content each time an application render occurs.
   *
   * For svelte-based content, the default is "force". For HTML and Handlebars content, the default is "handlebars".
   */
  abstract renderScheme?: RenderScheme;

  /**
   * Optional function to determine whether the tab should be visible when viewing the sheet. When excluded, it defaults to `true`.
   */
  abstract enabled?: (context: any) => boolean;

  /**
   * Optional function which is called each time a change detection cycle occurs on the sheet. This is any time a FormApplication would normally call `render()`.
   */
  abstract onRender?: (
    args: OnRenderArgs & { tabContentsElement: HTMLElement }
  ) => void;

  /**
   * An optional array of CSS classes to apply to the tab contents container.
   */
  abstract tabContentsClasses?: string[];
}
