import { CONSTANTS } from 'src/constants';

export function wrapHtmlForHandlebarsRendering(html: string) {
  return `<div style="display: contents;" ${CONSTANTS.HTML_DYNAMIC_RENDERING_ATTRIBUTE}>${html}</div>`;
}
