import type { RenderScheme } from 'src/api/api.types';
import { CONSTANTS } from 'src/constants';

export function wrapCustomHtmlForRendering(
  html: string,
  renderScheme: RenderScheme,
  id: string,
  activateDefaultSheetListeners?: boolean
) {
  const renderingAttribute =
    renderScheme === 'handlebars'
      ? ` ${CONSTANTS.HTML_DYNAMIC_RENDERING_ATTRIBUTE}`
      : '';
  const coreListenersTag = activateDefaultSheetListeners
    ? ` class="${CONSTANTS.CLASS_TIDY_USE_CORE_LISTENERS}"`
    : '';
  const groupId = getCustomContentGroupIdAttributeAndValue(id);
  return `<div style="display: contents;"${renderingAttribute}${coreListenersTag} ${groupId}>${html}</div>`;
}

function getCustomContentGroupIdAttributeAndValue(id: string) {
  return `data-tidy-custom-content-group-id="${id}"`;
}

export function getCustomContentGroupIdSelector(id: string) {
  return `[${getCustomContentGroupIdAttributeAndValue(id)}]`;
}
