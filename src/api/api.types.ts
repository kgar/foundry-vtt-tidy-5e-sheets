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

/**
 * A command, such as a button or a menu item, which can be executed on behalf of an item.
 */
export type ItemSummaryCommand = {
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
};

/**
 * Contextual information to assist with determining whether a command is appropriate for a particular item
 */
export type ItemSummaryCommandEnabledParams = {
  /**
   * The item for which the command will show.
   */
  item: any;
};

export type ItemSummaryCommandExecuteParams = {
  /**
   * The item for which the command was executed.
   */
  item: any;
};
