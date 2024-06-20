import type { CustomContent, HtmlRuntimeContent } from 'src/types/types';
import type { RegisteredContent, SheetLayout } from '../types';
import { HandlebarsTemplateRenderer } from 'src/runtime/HandlebarsTemplateRenderer';
import { error } from 'src/utils/logging';
import { HandlebarsContent } from 'src/api/content/HandlebarsContent';
import type { SupportedContent } from 'src/api/api.types';

export class CustomContentManager {
  static async prepareContentForRender(
    context: any,
    registeredContent: RegisteredContent<any>[]
  ): Promise<CustomContent[]> {
    let enabledContent = getEnabledContent(context, registeredContent);

    let customContent: CustomContent[] = [];

    for (let content of enabledContent) {
      let c: CustomContent = {
        content: await mapRenderableContent(context, content),
        position: content.injectParams?.position,
        selector: content.injectParams?.selector,
        activateDefaultSheetListeners: content.activateDefaultSheetListeners,
        onContentReady: content.onContentReady,
        onRender: content.onRender,
      };
      customContent.push(c);
    }

    return customContent;
  }

  static mapToRegisteredContent(
    content: SupportedContent,
    layout?: SheetLayout | SheetLayout[]
  ) {
    let mappedContent: HtmlRuntimeContent | HandlebarsTemplateRenderer =
      content instanceof HandlebarsContent
        ? new HandlebarsTemplateRenderer({
            path: content.path,
          })
        : ({
            html: content.html,
            renderScheme: content.renderScheme,
            type: 'html',
          } satisfies HtmlRuntimeContent);

    return {
      content: mappedContent,
      activateDefaultSheetListeners: content.activateDefaultSheetListeners,
      enabled: content.enabled,
      injectParams: content.injectParams,
      layout: layout ?? 'all',
      renderScheme: content.renderScheme,
      getData:
        content instanceof HandlebarsContent ? content.getData : undefined,
      onContentReady: content.onContentReady,
      onRender: content.onRender,
    } satisfies RegisteredContent<any>;
  }
}

function getEnabledContent<TContext>(
  context: TContext,
  registeredContent: RegisteredContent<any>[]
) {
  return [...registeredContent].filter((c) => {
    try {
      return c.enabled?.(context) ?? true;
    } catch (e) {
      error(
        'Unable to check custom content to determine if it is enabled because of an error',
        false,
        e
      );
      return false;
    }
  });
}

async function mapRenderableContent(
  data: any,
  registeredContent: RegisteredContent<any>
) {
  if (
    'type' in registeredContent.content &&
    registeredContent.content.type === 'html'
  ) {
    return registeredContent.content;
  }

  if (registeredContent.content instanceof HandlebarsTemplateRenderer) {
    const handlebarsData =
      typeof registeredContent.getData === 'function'
        ? await registeredContent.getData(data)
        : data;

    return {
      html: await registeredContent.content.render(handlebarsData),
      renderScheme: registeredContent.renderScheme ?? 'handlebars',
      type: 'html',
    } satisfies HtmlRuntimeContent;
  }

  error(
    'Unble to get custom content. The provided custom content information is unable to be rendered.',
    false,
    registeredContent
  );

  return {
    html: '',
    renderScheme: 'force',
    type: 'html',
  } satisfies HtmlRuntimeContent;
}
