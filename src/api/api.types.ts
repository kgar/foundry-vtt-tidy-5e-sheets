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
   * Rerender this content whenever the actor data changes.
   * This mimics the handlebars render scheme.
   * @default true
   */
  renderOnActorChange?: boolean;
  /**
   * 
   */
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
