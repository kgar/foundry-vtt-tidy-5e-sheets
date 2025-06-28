import type { SheetLayout } from 'src/runtime/types';
import type { HandlebarsTab } from './tab/HandlebarsTab';
import type { HtmlTab } from './tab/HtmlTab';
import type { SvelteTab } from './tab/SvelteTab';
import type { HtmlContent } from './content/HtmlContent';
import type { HandlebarsContent } from './content/HandlebarsContent';
import type { Actor5e } from 'src/types/types';

/**
 * Data provided after custom content has been prepared for rendering.
 */
/** @category Content */
export interface OnContentReadyParams extends OnRenderParams {
  /**
   * An HTML string that is ready to be rendered to the sheet.
   */
  content: string;
}

/**
 * Data provided during the rendering of this item document sheet.
 */
/** @category Shared */
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
/** @category Shared */
export type RenderScheme = 'handlebars' | 'force';

/**
 * The currently supported tab types.
 */
/** @category Tabs */
export type SupportedTab = HtmlTab | HandlebarsTab | SvelteTab;

/**
 * The currently supported tab types for Item sheets.
 */
/** @category Tabs */
export type SupportedItemTab = SupportedTab & {
  /**
   * The item type or types (e.g., "container", "feat", "weapon") where this tab should appear.
   * Omitting this field means the tab should show in all item sheets, if `enabled` is also true or omitted.
   */
  type?: string | string[];
};

/**
 * Options for registering an item tab.
 */
export interface ItemTabRegistrationOptions {
  /** When set to `true`, whenever this tab is navigated to, the window height will automatically adjust to match the content height. */
  autoHeight?: boolean;
  /**
   * An optional sheet layout or layouts (default: 'all')
   */
  layout?: SheetLayout;
}

/**
 * Options for registering an actor tab.
 */
/** @category Tabs */
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
/** @category Content */
export type SupportedContent = HtmlContent | HandlebarsContent;

/**
 * Options for registering content.
 */
/** @category Content */
export interface ContentRegistrationOptions {
  layout?: SheetLayout | SheetLayout[];
}

/**
 * A command, such as a button or a menu item, which can be executed on behalf of an item.
 */
/** @category Configuration */
export interface ItemSummaryCommand {
  /**
   * A label to use when displaying the command. Localization keys also work.
   */
  label?: string;
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
/** @category Configuration */
export interface ItemSummaryCommandEnabledParams {
  /**
   * The item for which the command will show.
   */
  item: any;
}

/**
 * Contextual information related to the item for which the target command was executed.
 */
/** @category Configuration */
export interface ItemSummaryCommandExecuteParams {
  /**
   * The inciting event
   */
  event: PointerEvent | MouseEvent;
  /**
   * The item for which the command was executed.
   */
  item: any;
}

/**
 * A command, eventually rendered as a control like a button or a menu item, which can be executed on behalf of an actor when accessing actor portrait menu options.
 */
/** @category Configuration */
export interface PortraitMenuCommand {
  /**
   * A label to use when displaying the command. Localization keys also work.
   */
  label?: string;
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
   * @param params contextual information to assist with determining whether a command is appropriate for a particular actor
   * @returns whether to include this command in the UI for the target actor
   */
  enabled?: (params: PortraitMenuCommandEnabledParams) => boolean;
  /**
   * An optional callback to allow for executing logic when a user executes the command.
   * @param params contextual information to assist with determining whether a command is appropriate for a particular actor
   * @returns void
   *
   * @remarks
   * It is up to the user to execute commands, such as clicking a button that represents the command. This is the general-purpose event handler for that button click.
   * Note that the command may instead be a menu item or other control for other scenarios, depending on the sheet and version of Tidy 5e.
   */
  execute?: (params: PortraitMenuCommandExecuteParams) => void;
}

/**
 * Contextual information to assist with determining whether a command is appropriate for a particular actor
 */
/** @category Configuration */
export interface PortraitMenuCommandEnabledParams {
  /**
   * The actor for which the command will show.
   */
  actor: any;
}

/**
 * Contextual information related to the actor for which the target command was executed.
 */
/** @category Configuration */
export interface PortraitMenuCommandExecuteParams {
  /**
   * The actor for which the command was executed.
   */
  actor: any;
  /**
   * The actor sheet context which is typically provided on render.
   */
  context: any;
}

/**
 * A command, eventually rendered as a control like a button or a menu item, which can be executed on behalf of an actor item section.
 */
/** @category Configuration */
export interface ActorItemSectionFooterCommand {
  /**
   * Optional label to use when displaying the command. Localization keys also work.
   */
  label?: string;
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
   * @param params contextual information to assist with determining whether a command is appropriate for a particular item section
   * @returns whether to include this command in the UI for the target item section
   *
   * @remarks
   * This option allows for scenarios such as showing a Versatile Damage button only when an item is tagged as versatile.
   */
  enabled?: (params: ActorItemSectionFooterCommandEnabledParams) => boolean;
  /**
   * An optional callback to allow for executing logic when a user executes the command.
   * @param item the item for which the command has been executed
   * @returns void
   *
   * @remarks
   * It is up to the user to execute commands, such as clicking a button that represents the command. This is the general-purpose event handler for that button click.
   * Note that the command may instead be a menu item or other control for other scenarios, depending on the sheet and version of Tidy 5e.
   */
  execute?: (params: ActorItemSectionFooterCommandExecuteParams) => void;
}

/** @category Configuration */
export interface ActorItemSectionFooterCommandEnabledParams {
  /**
   * The actor for whom the command will show.
   */
  actor: Actor5e;
  /**
   * The item section for which the command will show.
   */
  section: any;
}

/** @category Configuration */
export interface ActorItemSectionFooterCommandExecuteParams {
  /**
   * The actor for whom the command was executed.
   */
  actor: Actor5e;
  /**
   * The item section for which the command was executed.
   */
  section: any;
  /**
   * Any user-initiated event which triggered the command execution. For example, a MouseEvent or PointerEvent.
   */
  event: Event;
}

/**
 * Information needed to configure specific-level exhaustion.
 */
/** @category Configuration */
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
}

/**
 * Optional params which, when provided, will cause
 * the custom content to be rendered at the designated `position`
 * in relation to all instances of the found `selector`.
 *
 * @remarks
 * This interface leverages the API for [Element: insertAdjacentHTML() method](https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML).
 */
/** @category Content */
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

/**
 * A custom equipment type group, to be rendered in the Equipment Type section of the Item Sheet.
 *
 * @example Custom Helmet Types
 * ```js
 * {
 *   label: 'Helmet',
 *   types: {
 *     clothhat: 'Clothings Helmet',
 *     lighthat: 'Light Helmet',
 *     mediumhat: 'Medium Helmet',
 *     heavyhat: 'Heavy Helmet',
 * }
 * ```
 *
 * @example Custom Helmet Types (with Localization Keys)
 * ```js
 * {
 *   label: 'MyModuleId.HelmetType.Label',
 *   types: {
 *     clothhat: 'MyModuleId.HelmetType.ClothingsHelmet.Label',
 *     lighthat: 'MyModuleId.HelmetType.LightHelmet.Label',
 *     mediumhat: 'MyModuleId.HelmetType.MediumHelmet.Label',
 *     heavyhat: 'MyModuleId.HelmetType.HeavyHelmet.Label',
 * }
 * ```
 */
export type EquipmentTypeGroup = {
  /** A group label. Localization keys also work. */
  label: string;
  /**
   * An object where the key is the equipment type ID, and the value is the label text.
   * Localization keys also work.
   */
  types: Record<string, string>;
};

/**
 * A custom header control to be placed in the controls menu of an Application V2 window.
 *
 * @example Making a debug button
 * ```js
 * const entry = {
 *   icon: 'fas fa-broom',
 *   label: 'Debug Button',
 *   visible(app, document) {
 *     return document.type === 'container';
 *   },
 *   ownership: CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER,
 *   onClickAction(event, target) {
 *     ui.notifications.info(`Doing cool stuff with ${this.name}.`)
 *   },
 *   position: 'header'
 * }
 * ```
 */
export interface CustomHeaderControlsEntry {
  /**
   * A fontawesome icon class, e.g., "fas fa-broom"
   */
  icon: string;
  /**
   * The header control text to show.
   */
  label: string;
  /**
   * Optional action name. This name is used when coordinating
   * header control clicks and App V2 action handlers.
   * If no name is provided, a name will be generated.
   */
  action?: string;
  /**
   * A boolean or function signifying whether the menu option should be shown.
   * Use the function to conditionally show/hide the menu option on each render.
   * `this` is the application v2 instance.
   */
  visible?: boolean | ((this: any) => boolean);
  /**
   * A key or value in CONST.DOCUMENT_OWNERSHIP_LEVELS that restricts
   * visibility of this option for the current user.
   */
  ownership?: string | number;
  /**
   * A handler for when this header control is clicked. `this` is the application instance.
   *
   * @param event the pointer event that triggered the handler
   * @param target the header control that was clicked
   * @returns
   */
  onClickAction?: (event: PointerEvent, target: HTMLElement) => Promise<void>;
  /**
   * Denotes whether to put the control in the header menu ('menu')
   * or directly on the header ('header').
   *
   * Default: 'menu'.
   */
  position?: SheetHeaderControlPosition;
}

/**
 * A position for sheet header controls.
 * 'menu' - the control is placed inside the header controls menu
 * 'header' - the control is placed on the header itself, outside of the menu
 */
export type SheetHeaderControlPosition = 'menu' | 'header';

/**
 * The parameters needed to register header controls.
 */
export type HeaderControlRegistrationParams = {
  /**
   * The controls to be registered.
   */
  controls: CustomHeaderControlsEntry[];
};
