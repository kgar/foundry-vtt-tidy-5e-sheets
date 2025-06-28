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
 *
 * @category Tabs
 */
export type TabId = string;

/** @category Tabs */
export type CustomTabTitle = string | (() => string);

/**
 * The basis of all custom registered tabs.
 */
/** @category Tabs */
export abstract class CustomTabBase {
  /**
   * The title to display on the tab. Accepts localization keys and plain text.
   */
  abstract title: CustomTabTitle;

  /**
   * A FontAwesome icon class string. If provided, an icon will be included with the tab.
   */
  abstract iconClass?: string;

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
   * Optional function which is called each time a change detection cycle occurs on the sheet. This is any time a Foundry Application would normally call `render()`.
   */
  abstract onRender?: (params: OnRenderTabParams) => void;

  /**
   * An optional array of CSS classes to apply to the tab contents container.
   */
  abstract tabContentsClasses?: string[];
}
