import type {
  OnContentReadyParams,
  OnRenderParams,
  RenderScheme,
} from 'src/api';
import { CONSTANTS } from 'src/constants';
import type { ApplicationRenderOptions } from 'src/types/application.types';
import { CustomContentManager } from 'src/runtime/content/CustomContentManager';
import type { RegisteredContent } from 'src/runtime/types';
import type { CustomContent, Tab } from 'src/types/types';
import { isNil } from 'src/utils/data';
import { debug, error, warn } from 'src/utils/logging';

export type RenderedSheetPart = {
  position?: string;
  selector?: string;
  renderScheme: RenderScheme;
  content: string;
  onContentReady?: (params: OnContentReadyParams) => void;
  onRender?: (params: OnRenderParams) => void;
};

export class CustomContentRendererV2 {
  async renderCustomContent(
    registeredContent: RegisteredContent<any>[],
    context: unknown,
    options: ApplicationRenderOptions
  ): Promise<RenderedSheetPart[]> {
    let customContents: CustomContent[] =
      await this.#prepareContentForRendering(
        context,
        registeredContent,
        options
      );

    let parts: RenderedSheetPart[] = [];
    for (let content of customContents) {
      try {
        let contentHtml =
          typeof content.content.html === 'function'
            ? content.content.html(context)
            : content.content.html;

        parts.push({
          content: contentHtml,
          position: content.position,
          selector: content.selector,
          renderScheme: content.content.renderScheme,
          onContentReady: content.onContentReady,
          onRender: content.onRender,
        });
      } catch (e) {
        error('An error occurred while rendering custom content', false, {
          error: e,
          context,
          content,
          options,
        });
      }
    }

    return parts;
  }

  async #prepareContentForRendering(
    context: unknown,
    registeredContent: RegisteredContent<any>[],
    options: ApplicationRenderOptions
  ) {
    let customContents: CustomContent[] = [];
    try {
      customContents = await CustomContentManager.prepareContentForRender(
        context,
        registeredContent
      );
    } catch (e) {
      error(
        'An error occurred while preparing custom content for render',
        false,
        {
          error: e,
          context,
          options,
        }
      );
    }
    return customContents;
  }

  async renderTabContents(
    tabs: Tab[],
    context: unknown,
    options: ApplicationRenderOptions
  ): Promise<RenderedSheetPart[]> {
    // prepare tabs for render

    // render tabs
    const promises = tabs.map<Promise<RenderedSheetPart | undefined>>(
      async (tab) => {
        try {
          let content: string = '';
          let renderScheme: RenderScheme = 'force';

          if (
            tab.content.type === 'html' &&
            (options.isFirstRender || tab.content.renderScheme === 'handlebars')
          ) {
            content = tab.content.html;
            renderScheme = tab.content.renderScheme;
          }
          const selector = `[data-tab-contents-for="${tab.id}"]`;
          const position: InsertPosition = 'afterbegin';
          return {
            content: content,
            renderScheme: renderScheme,
            position: position,
            selector: selector,
            onRender: (params) =>
              // Retrofit tab render to satisfy unified structure
              tab.onRender?.({
                app: params.app,
                data: params.data,
                element: params.data,
                isFullRender: params.isFullRender,
                tabContentsElement:
                  params.element.querySelector<HTMLElement>(selector)!,
              }),
          } satisfies RenderedSheetPart;
        } catch (e) {
          error('Failed to render custom content due to an error', false, e);
          debug('Custom content error debug details', {
            error: e,
            tab,
            context,
            options,
          });
        }
      }
    );

    return (await Promise.all(promises)).filter((t) => !!t);
  }

  replaceCustomContent(
    parts: RenderedSheetPart[],
    sheet: any,
    context: unknown,
    options: ApplicationRenderOptions
  ) {
    sheet.element
      .querySelectorAll(CONSTANTS.HTML_DYNAMIC_RENDERING_ATTRIBUTE_SELECTOR)
      .forEach((el: HTMLElement) => el.remove());

    for (let part of parts) {
      try {
        part.onContentReady?.({
          app: sheet,
          content: part.content,
          data: context,
          element: sheet.element,
          isFullRender: !!options.isFirstRender,
        });
      } catch (e) {
        error(
          'An error occurred while invoking the onContentReady callback for custom content',
          false,
          { error: e, part, sheet }
        );
      }

      const canInsertHtml = !isNil(part.position) && !isNil(part.selector);

      if (canInsertHtml) {
        const anchorElements = Array.from<HTMLElement>(
          sheet.element.querySelectorAll(part.selector)
        );

        const wrappedContent = this.#wrapCustomHtmlForRendering(
          part.content,
          part.renderScheme
        );

        for (let el of anchorElements) {
          el.insertAdjacentHTML(
            part.position as InsertPosition,
            wrappedContent
          );
        }
      }

      try {
        part.onRender?.({
          app: sheet,
          data: context,
          element: sheet.element,
          isFullRender: !!options.isFirstRender,
        });
      } catch (e) {
        error(
          'An error occurred while invoking the onRender callback for custom content',
          false,
          { error: e, part, sheet }
        );
      }
    }
  }

  #wrapCustomHtmlForRendering(html: string, renderScheme: RenderScheme) {
    const renderingAttribute =
      renderScheme === 'handlebars'
        ? ` ${CONSTANTS.HTML_DYNAMIC_RENDERING_ATTRIBUTE}`
        : '';
    return `<div style="display: contents;"${renderingAttribute}>${html}</div>`;
  }
}
