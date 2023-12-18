import type { SheetLayout } from 'src/runtime/types';
import type { HandlebarsTab } from './tab/HandlebarsTab';
import type { HtmlTab } from './tab/HtmlTab';
import type { SvelteTab } from './tab/SvelteTab';

/**
 * Data provided during the rendering of this item document sheet.
 */
export interface OnRenderArgs {
  /**
   * The sheet application instance.
   */
  app: any;
  /**
   * The document sheet application element. This is the entire application window, including the header.
   */
  element: HTMLElement;
  /**
   * The item sheet context which is typically passed to the handlebars template
   */
  data: any;
  /**
   * Denotes whether this is a full/forced render or a change detection cycle. For non-svelte content, this field allows content to react to partial re-rendering.
   */
  isFullRender: boolean;
}

/**
 * Determines when custom content will be rendered.
 * - `"handlebars"` - render on each change detection cycle (actor data changed, setting data changed, embedded item changed, etc.)
 * - `"force"`, `undefined`, or any other unspecified value - render when the `render` function is called with `force=true`, i.e. a full re-render
 */
export type RenderScheme = 'handlebars' | 'force';

/**
 * The currently supported tab types.
 */
export type SupportedTab = HtmlTab | HandlebarsTab | SvelteTab;

/**
 * Options for registering an actor tab.
 */
export type ActorTabRegistrationOptions = {
  /**
   * An optional sheet layout or layouts (default: 'all')
   */
  layout?: SheetLayout | SheetLayout[];
  /**
   * Determines whether a newly registered tab should override an existing of the same tab ID.
   * Useful for replacing core Tidy 5e Sheet tabs.
   */
  overrideExisting?: boolean;
};
