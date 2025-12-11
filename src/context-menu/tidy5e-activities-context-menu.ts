import { CONSTANTS } from 'src/constants';
import { getContextMenuOptionsQuadrone } from './tidy5e-activities-context-menu-quadrone';

export function configureActivitiesContextMenu(element: HTMLElement, app: any) {
  const itemId = element.closest<HTMLElement>('[data-item-id]')?.dataset.itemId;
  const item =
    app.document.type === 'container'
      ? app.document.system.getContainedItem(itemId)
      : app.document.documentName === CONSTANTS.DOCUMENT_NAME_ITEM
      ? app.document
      : app.document.items.get(itemId);

  // Parts of ContextMenu doesn't play well with promises, so don't show menus for containers in packs
  if (!item || item instanceof Promise) {
    return;
  }

  const activityElement = element.closest<HTMLElement>('[data-activity-id]');
  const activityId = activityElement?.getAttribute('data-activity-id');

  /**
   * Activities are denoted as configurable or not.
   * Non-configurable activities include special activities like facility orders.
   */
  const configurable =
    activityElement?.matches('[data-configurable="true"]') === true;

  const activity = item.system.activities?.get(activityId);
  if (!activity) {
    return;
  }

  const menuItems = getContextMenuOptionsQuadrone(
    activity,
    app,
    configurable,
    element
  );

  /**
   * A hook even that fires when the context menu for an Activity is opened.
   * @function dnd5e.getItemActivityContext
   * @memberof hookEvents
   * @param {Activity} activity             The Activity.
   * @param {HTMLElement} target            The element that menu was triggered on.
   * @param {ContextMenuEntry[]} menuItems  The context menu entries.
   */
  Hooks.callAll('dnd5e.getItemActivityContext', activity, element, menuItems);
  ui.context.menuItems = menuItems;
}
