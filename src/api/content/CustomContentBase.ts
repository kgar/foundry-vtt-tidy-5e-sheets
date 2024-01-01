import type {
  CustomContentInjectParams,
  OnContentReadyParams,
  OnRenderParams,
  RenderScheme,
} from '../api.types';

export abstract class CustomContentBase {
  /** {@inheritDoc CustomContentInjectParams} */
  abstract injectParams?: CustomContentInjectParams;

  /**
   * Optionally determines whether to refresh content each time an application render occurs.
   *
   * For svelte-based content, the default is "force". For HTML and Handlebars content, the default is "handlebars".
   */
  abstract renderScheme?: RenderScheme;

  /**
   * Optional function to determine whether the content should be rendered. When excluded, it defaults to `true`.
   */
  abstract enabled?: (context: any) => boolean;

  /**
   * After the custom content has been prepared for rendering and is ready to inject into the sheet,
   * this callback is invoked.
   *
   * @remarks
   * For more complex HTML insertion scenarios, one can skip {@link CustomContentInjectParams}
   * and simply inject the prepared content with this callback.
   *
   * This callback is also useful for quick debug logging of the content to be rendered.
   */
  abstract onContentReady?: (params: OnContentReadyParams) => void;

  /**
   * Optional function which is called each time a change detection cycle occurs on the sheet. This is any time a FormApplication would normally call `render()`.
   */
  abstract onRender?: (params: OnRenderParams) => void;

  /**
   * An optional override to whether the target content should use default sheet event listeners.
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
