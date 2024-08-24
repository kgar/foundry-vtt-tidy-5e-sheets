import type { ApplicationRenderOptions } from "./SvelteApplicationMixin";


export function TidyHandlebarsIntegrationApplicationMixin<TContext>(
  BaseApplication: any
) {
  class TidyHandlebarsIntegrationApplication extends BaseApplication {
    async _renderHTML(context: TContext, options: ApplicationRenderOptions) {
      const result = await super._renderHTML(context, options);
      console.log('_renderHTML', context, options);
      // Prepare API-driven custom content here
      return result;
    }

    _replaceHTML(
      result: any,
      content: HTMLElement,
      options: ApplicationRenderOptions
    ) {
      super._replaceHTML(result, content, options);
      console.log('_replaceHTML', result, content, options);
      // Remove `data-tidy-render-scheme="handlebars"` content here?
      // Add replacement stuff; TODO: add TS types for this
    }
  }
}
