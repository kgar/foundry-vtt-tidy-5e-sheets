import { CONSTANTS } from 'src/constants';
import type { Activity5e } from 'src/foundry/dnd5e.types';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { ContextMenuEntry } from 'src/foundry/foundry.types';
import { SheetPinsProvider } from 'src/features/sheet-pins/SheetPinsProvider';

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

function getContextMenuOptionsQuadrone(
  activity: Activity5e,
  app: any,
  configurable: boolean,
  element: HTMLElement
): ContextMenuEntry[] {
  const isUnlockedForOwner =
    activity.item.isOwner &&
    !FoundryAdapter.isLockedInCompendium(activity.item);

  const isInFavorites = !!element.closest('.favorites');

  // Common - these are standard options, or they're options that Tidy offers which interface with standard foundry behaviors.

  const entries: ContextMenuEntry[] = [];
  entries.push({
    name: 'DND5E.ContextMenuActionView',
    icon: '<i class="fas fa-eye fa-fw"></i>',
    condition: () => configurable && !isUnlockedForOwner,
    callback: async () => await activity.sheet.render({ force: true }),
    group: 'common',
  });

  entries.push({
    name: 'DND5E.ContextMenuActionEdit',
    icon: '<i class="fas fa-pen-to-square fa-fw"></i>',
    condition: () => configurable && isUnlockedForOwner,
    callback: async () => await activity.sheet.render({ force: true }),
    group: 'common',
  });

  if ('favorites' in (app.actor?.system ?? {})) {
    const uuid = `${activity.item.getRelativeUUID(app.actor)}.Activity.${
      activity.id
    }`;
    const isFavorited = app.actor.system.hasFavorite(uuid);
    entries.push({
      name: isFavorited ? 'DND5E.FavoriteRemove' : 'DND5E.Favorite',
      icon: isFavorited
        ? `<i class='fa-regular fa-star fa-fw'></i>`
        : `<i class='fa-solid fa-star fa-fw inactive'></i>`,
      condition: () => isUnlockedForOwner,
      callback: async () => {
        if (isFavorited) {
          await app.actor.system.removeFavorite(uuid);
        } else {
          await app.actor.system.addFavorite({ type: 'activity', id: uuid });
        }
      },
      group: 'common',
    });
  }

  entries.push({
    name: 'DND5E.ContextMenuActionDuplicate',
    icon: '<i class="fas fa-copy fa-fw"></i>',
    condition: () => !isInFavorites && configurable && isUnlockedForOwner,
    callback: async () => {
      const createData = activity.toObject();
      delete createData._id;
      await activity.item.createActivity(createData.type, createData, {
        renderSheet: false,
      });
    },
    group: 'common',
  });

  // Customize - These are things Tidy provides above and beyond the system for greater customization of the sheet.

  entries.push({
    name: 'TIDY5E.ContextMenuActionPin',
    icon: `<i class="fa-solid fa-thumbtack"></i>`,
    callback: async () => await SheetPinsProvider.pin(activity, 'activity'),
    condition: () =>
      app.actor &&
      activity.item.isOwner &&
      !FoundryAdapter.isLockedInCompendium(activity.item) &&
      SheetPinsProvider.isPinnable(activity, 'activity') &&
      !SheetPinsProvider.isPinned(activity),
    group: 'pins',
  });

  entries.push({
    name: 'TIDY5E.ContextMenuActionUnpin',
    icon: `<i class="fa-regular fa-thumbtack"></i>`,
    callback: async () => await SheetPinsProvider.unpin(activity),
    condition: () =>
      activity.item.isOwner &&
      !FoundryAdapter.isLockedInCompendium(activity.item) &&
      SheetPinsProvider.isPinnable(activity, 'activity') &&
      SheetPinsProvider.isPinned(activity),
    group: 'pins',
  });

  // Be Careful - These are the no-going-back changes

  entries.push({
    name: 'DND5E.ContextMenuActionDelete',
    icon: `<i class="fas fa-trash fa-fw" style="color: var(--t5e-warning-accent-color);"></i>`,
    condition: () => !isInFavorites && configurable && isUnlockedForOwner,
    callback: async () => await activity.deleteDialog(),
    group: 'be-careful',
  });

  return entries;
}
