import type {
  CustomContentInjectParams,
  OnContentReadyParams,
  OnRenderParams,
  RenderScheme,
} from '../api.types';

/** @category Content */
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
   * @deprecated Tidy is moving to Application V2, and there will no longer be any default sheet listeners. Be sure to provide your own event handling for the content that is injected.
   */
  abstract activateDefaultSheetListeners?: boolean;
}
