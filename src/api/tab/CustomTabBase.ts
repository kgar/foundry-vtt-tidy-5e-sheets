import type { OnRenderTabParams } from 'src/types/types';
import type { RenderScheme } from '../api.types';

/**
 * The required static ID associated with a tab.
 *
 * @remarks
 * A `tabId` is a unique string of text that identifies your tab.
 * It needs to be in a format that can be put into an HTML attribute.
 * The tab ID is always required to register a tab.
 *
 * A `tabId` must be unique to the target sheet. For example,
 * the character sheet can only have one "my-module-id-my-spellbook-tab" ID,
 * and the NPC sheet can also only have one "my-module-id-my-spellbook-tab" ID, etc.
 *
 * Advice for crafting a unique tab ID:
 * - for modules, use your module ID as a prefix (e.g., "my-module-id")
 *   - for world scripts, use your game world name (e.g., "my-game-world")
 * - add a hyphenated version of the tab title (e.g., for a tab titled "My Spellbook Tab", use "my-spellbook-tab")
 * - join these two pieces together with a hyphen:
 * ```
 * "my-module-id-my-spellbook-tab"
 * ```
 */
export type TabId = string;

export type CustomTabTitle = string | (() => string);

/**
 * The basis of all custom registered tabs.
 */
export abstract class CustomTabBase {
  /**
   * The title to display on the tab. Accepts localization keys and plain text.
   */
  abstract title: CustomTabTitle;

  /** {@inheritDoc TabId} */
  abstract tabId: TabId;

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
  abstract onRender?: (params: OnRenderTabParams) => void;

  /**
   * An optional array of CSS classes to apply to the tab contents container.
   */
  abstract tabContentsClasses?: string[];

  /**
   * An optional override to whether the target tab should use default sheet event listeners.
   * Defaults to `false`.
   * 
   * @remarks
   * The default sheet listeners pertain to the default 5e sheets. Behaviors include but are not limited to
   * - `data-action` click handling
   * - drag-and-drop behaviors
   * - rollable items click handling
   * - item controls click handling
   * - proficiency toggling
   * - ... etc.
   *
   * Leaving this field `false` means you wish to take full control of the event handling of your content.
   */
  abstract activateDefaultSheetListeners?: boolean;
}
