import type { SheetLayout } from 'src/runtime/types';
import type { HandlebarsTab } from './tab/HandlebarsTab';
import type { HtmlTab } from './tab/HtmlTab';
import type { SvelteTab } from './tab/SvelteTab';
import type { HtmlContent } from './content/HtmlContent';
import type { HandlebarsContent } from './content/HandlebarsContent';

/**
 * Data provided after custom content has been prepared for rendering.
 */
export interface OnContentReadyParams extends OnRenderParams {
  /**
   * An HTML string that is ready to be rendered to the sheet.
   */
  content: string;
}

/**
 * Data provided during the rendering of this item document sheet.
 */
export interface OnRenderParams {
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
export interface ActorTabRegistrationOptions {
  /**
   * An optional sheet layout or layouts (default: 'all')
   */
  layout?: SheetLayout | SheetLayout[];
  /**
   * Determines whether a newly registered tab should override an existing of the same tab ID.
   * Useful for replacing core Tidy 5e Sheet tabs.
   */
  overrideExisting?: boolean;
}

/**
 * The currently supported custom content types.
 */
export type SupportedContent = HtmlContent | HandlebarsContent;

/**
 * Options for registering content.
 */
export interface ContentRegistrationOptions {
  layout?: SheetLayout | SheetLayout[];
}

/**
 * A command, such as a button or a menu item, which can be executed on behalf of an item.
 */
export interface ItemSummaryCommand {
  /**
   * A label to use when displaying the command. Localization keys also work.
   */
  label: string;
  /**
   * Optional string of CSS classes representing a FontAwesome icon to be rendered with the command.
   */
  iconClass?: string;
  /**
   * Optional tooltip text for the target command.
   */
  tooltip?: string;
  /**
   * An optional callback which allows for conditionally including a command. If not included, defaults to `true`.
   * @param params contextual information to assist with determining whether a command is appropriate for a particular item
   * @returns whether to include this command in the UI for the target item
   *
   * @remarks
   * This option allows for scenarios such as showing a Versatile Damage button only when an item is tagged as versatile.
   */
  enabled?: (params: ItemSummaryCommandEnabledParams) => boolean;
  /**
   * An optional callback to allow for executing logic when a user executes the command.
   * @param item the item for which the command has been executed
   * @returns void
   *
   * @remarks
   * It is up to the user to execute commands, such as clicking a button that represents the command. This is the general-purpose event handler for that button click.
   * Note that the command may instead be a menu item or other control for other scenarios, depending on the sheet and version of Tidy 5e.
   */
  execute?: (params: ItemSummaryCommandExecuteParams) => void;
}

/**
 * Contextual information to assist with determining whether a command is appropriate for a particular item
 */
export interface ItemSummaryCommandEnabledParams {
  /**
   * The item for which the command will show.
   */
  item: any;
}

export interface ItemSummaryCommandExecuteParams {
  /**
   * The item for which the command was executed.
   */
  item: any;
}

/**
 * Information needed to configure specific-level exhaustion.
 */
export interface UseSpecificLevelExhaustionParams {
  /**
   * The max number of levels. If not specified or less than 1, will default to `1`.
   */
  totalLevels?: number;
  /**
   * Optional hints (usually rendered as tooltips).
   * Localization keys also work.
   *
   * @remarks
   * This array should include level 0, meaning it is length `totalLevels + 1`.
   * For example, with `totalLevels` of 3:
   *
   * 0. 'No exhaustion'
   * 1. 'You are kind of tired'
   * 2. 'You look unwell'
   * 3. 'Dead 💀'
   *
   * > `['No exhaustion', 'You are kind of tired', 'You look unwell', 'Dead 💀']`
   */
  hints?: string[];
};

/**
 * Optional params which, when provided, will cause
 * the custom content to be rendered at the designated `position`
 * in relation to all instances of the found `selector`.
 *
 * @remarks
 * This interface leverages the API for [Element: insertAdjacentHTML() method](https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML).
 */
export interface CustomContentInjectParams {
  /**
   * A string representing the position relative to the element.
   * Must be one of the following strings:
   * - `"beforebegin"`: Before the element. Only valid if the element is in the DOM tree and has a parent element.
   * - `"afterbegin"`: Just inside the element, before its first child.
   * - `"beforeend"`: Just inside the element, after its last child.
   * - `"afterend"`: After the element. Only valid if the element is in the DOM tree and has a parent element.
   *
   * @remarks
   * See [Element: insertAdjacentHTML() method](https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML) for more details.
   */
  position: string;
  /**
   * The selector to use when looking for the place to insert adjacent HTML.
   * This is scoped to the sheet where this content was registered.
   *
   * @example
   * ```'[data-tidy-field="name"]'```
   */
  selector: string;
}
