import { CONSTANTS } from 'src/constants';
import { warn } from 'src/utils/logging';
import { configureItemContextMenu } from './tidy5e-item-context-menu';
import { configureActiveEffectsContextMenu } from './tidy5e-active-effect-context-menu';
import { configureGroupContextMenu } from './tidy5e-group-context-menu';
import { configureFacilityContextMenu } from './tidy5e-facility-context-menu';
import { configureActivitiesContextMenu } from './tidy5e-activities-context-menu';
import FloatingContextMenu from './FloatingContextMenu';

export function initTidy5eContextMenu(
  sheet: any,
  html: any,
  contextMenuSelector: string = '[data-context-menu]'
) {
  if ('get' in html) {
    html = html[0];
  }

  new FloatingContextMenu(html, contextMenuSelector, [], {
    onOpen: onDocumentContext.bind(sheet),
    jQuery: true,
  });
}

/**
 * Handle activation of a context menu for an embedded Item or ActiveEffect document.
 * Dynamically populate the array of context menu options.
 * @param {HTMLElement} element       The HTML element for which the context menu is activated
 * @protected
 */
function onDocumentContext(this: any, element: HTMLElement) {
  const contextMenuType = element.getAttribute('data-context-menu');

  const app = this;

  switch (contextMenuType) {
    case CONSTANTS.CONTEXT_MENU_TYPE_ACTIVITIES:
      configureActivitiesContextMenu(element, app);
      break;
    case CONSTANTS.CONTEXT_MENU_TYPE_EFFECTS:
      configureActiveEffectsContextMenu(element, app);
      break;
    case CONSTANTS.CONTEXT_MENU_TYPE_FACILITY_OCCUPANTS:
      configureFacilityContextMenu(element, app);
      break;
    case CONSTANTS.CONTEXT_MENU_TYPE_GROUP_MEMBER:
      configureGroupContextMenu(element, app);
      break;
    case CONSTANTS.CONTEXT_MENU_TYPE_ITEMS:
      configureItemContextMenu(element, app);
      break;
    default:
      warn(
        `Unable to show context menu. The menu type ${contextMenuType} is not supported. Put a [data-context-menu] attribute on the target entity and implement the handler where this warning appears.`
      );
      break;
  }
}
