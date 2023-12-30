import type { RenderScheme } from 'src/api';
import { CONSTANTS } from 'src/constants';

export function wrapCustomHtmlForRendering(
  html: string,
  renderScheme: RenderScheme
) {
  const renderingAttribute =
    renderScheme === 'handlebars'
      ? ` ${CONSTANTS.HTML_DYNAMIC_RENDERING_ATTRIBUTE}`
      : '';
  return `<div style="display: contents;"${renderingAttribute}>${html}</div>`;
}
