import type { HandlebarsContent } from './HandlebarsContent';

/**
 * Content which can be injected into Tidy 5e Sheets via the API.
 */
export type InjectableContent =
  | string
  | HTMLElement
  | HTMLElement[]
  | HandlebarsContent;

/**
 * Options for how and what to render, as well as callbacks
 * which grant access to the target section.
 */
export interface RegisterItemDetailsSectionOptions {
  /**
   * Content for the section title.
   * It will be contained within the appropriate header element.
   * To supply your own header, do not set this field
   * and instead prepend sibling to the HTMLElement in the onRender callback.
   */
  sectionTitle?: InjectableContent;
  /**
   * A callback for when the custom section and title have been rendered to the DOM.
   * When this callback is invoked, any content provided in the content option will have already been rendered.
   *
   * Some suggested uses for this callback:
   * - dynamic HTML injection based on more complex logic
   * - any custom event wiring for your content
   */
  onRender?(args: OnRenderArgs): void;
  /**
   * Determines when the injected content will render.
   * - 'handlebars': the content will rerender every time the render event is called.
   * - `undefined`: the content will rerender when render is called with `force=true`
   * @default 'handlebars'
   */
  renderStrategy?: 'handlebars';
  /**
   * The content to be rendered within the section.
   * @default undefined
   */
  content?: InjectableContent;
  /**
   * Allows for preparing data in any special way or to make any other miscellaneous preparations leading up to rendering the item.
   * @param data the item sheet context
   * @returns void
   */
  onPrepareData?: (data: any) => void;
  /**
   * Determines whether this custom applies to the target item to be rendered.
   * @param data the item sheet context
   * @returns boolean for whether to use this custom section or not
   */
  enabled?: (data: any) => boolean;
}

/**
 * Data provided during the rendering of this item section.
 */
export interface OnRenderArgs {
  /**
   * An empty HTMLElement container for your content
   */
  node: HTMLElement;
  /**
   * An Item5e instance from the dnd5e system
   */
  item: any;
  /**
   * The item sheet context which is typically passed to the handlebars template
   */
  itemSheetContext: any;
}
