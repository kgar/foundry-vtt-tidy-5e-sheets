import type {
  CustomContent,
  RenderedHtml,
  RenderableHtml,
} from 'src/types/types';
import type { RegisteredContent, SheetLayout } from '../types';
import { HandlebarsTemplateRenderer } from 'src/runtime/HandlebarsTemplateRenderer';
import { error } from 'src/utils/logging';
import { HandlebarsContent } from 'src/api/content/HandlebarsContent';
import type { SupportedContent } from 'src/api/api.types';
import { CONSTANTS } from 'src/constants';

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
        onContentReady: content.onContentReady,
        onRender: content.onRender,
      };
      customContent.push(c);
    }

    return customContent;
  }

  static mapToRegisteredContents(
    content: SupportedContent,
    layoutPreference?: SheetLayout | SheetLayout[]
  ): RegisteredContent<any>[] {
    layoutPreference ??= [CONSTANTS.SHEET_LAYOUT_ALL];

    if (typeof layoutPreference === 'string') {
      layoutPreference = [layoutPreference];
    }

    let registeredContent: RegisteredContent<any>[] = [];

    for (let layout of layoutPreference) {
      let mappedContent: RenderableHtml | HandlebarsTemplateRenderer =
        content instanceof HandlebarsContent
          ? new HandlebarsTemplateRenderer({
              path: content.path,
            })
          : ({
              html: content.html,
              renderScheme: content.renderScheme,
              type: 'html',
            } satisfies RenderableHtml);

      registeredContent.push({
        content: mappedContent,
        enabled: content.enabled,
        injectParams: content.injectParams,
        layout: layout,
        renderScheme: content.renderScheme,
        getData:
          content instanceof HandlebarsContent ? content.getData : undefined,
        onContentReady: content.onContentReady,
        onRender: content.onRender,
      } satisfies RegisteredContent<any>);
    }

    return registeredContent;
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
    } satisfies RenderedHtml;
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
  } satisfies RenderedHtml;
}
