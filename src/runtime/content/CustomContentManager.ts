import type { CustomContent, HtmlRuntimeContent } from 'src/types/types';
import type { RegisteredContent } from '../types';
import { isNil } from 'src/utils/data';
import { HandlebarsTemplateRenderer } from 'src/api/HandlebarsTemplateRenderer';
import { error } from 'src/utils/logging';

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
        position: content.position,
        selector: content.selector,
        activateDefaultSheetListeners: content.activateDefaultSheetListeners,
        onRender: content.onRender,
      };
      customContent.push(c);
    }

    return customContent;
  }
}

function getEnabledContent<TContext>(
  context: TContext,
  registeredContent: RegisteredContent<any>[]
) {
  return [...registeredContent].filter(
    (c) =>
      isNil(c.enabled) ||
      (typeof c.enabled === 'function' && c.enabled(context))
  );
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
