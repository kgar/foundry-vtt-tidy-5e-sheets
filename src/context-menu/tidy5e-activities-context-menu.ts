import { CONSTANTS } from 'src/constants';
import { AttributePins } from 'src/features/attribute-pins/AttributePins';
import type { Activity5e } from 'src/foundry/dnd5e.types';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { ContextMenuEntry } from 'src/foundry/foundry.types';
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

  const isQuadroneSheet = element.closest('.quadrone');

  const menuItems = isQuadroneSheet
    ? getContextMenuOptionsQuadrone(activity, app, configurable)
    : getContextMenuOptions(activity, app, configurable);

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

function getContextMenuOptions(
  activity: Activity5e,
  app: any,
  configurable: boolean
): ContextMenuEntry[] {
  const entries: ContextMenuEntry[] = [];

  if (
    activity.item.isOwner &&
    !FoundryAdapter.isLockedInCompendium(activity.item)
  ) {
    entries.push(
      {
        name: 'DND5E.ContextMenuActionEdit',
        icon: '<i class="fas fa-pen-to-square fa-fw"></i>',
        callback: async () => await activity.sheet.render({ force: true }),
        condition: () => configurable,
      },
      {
        name: 'DND5E.ContextMenuActionDuplicate',
        icon: '<i class="fas fa-copy fa-fw"></i>',
        callback: async () => {
          const createData = activity.toObject();
          delete createData._id;
          await activity.item.createActivity(createData.type, createData, {
            renderSheet: false,
          });
        },
        condition: () => configurable,
      },
      {
        name: 'DND5E.ContextMenuActionDelete',
        icon: '<i class="fas fa-trash fa-fw"></i>',
        callback: async () => await activity.deleteDialog(),
        condition: () => configurable,
      }
    );
  } else {
    entries.push({
      name: 'DND5E.ContextMenuActionView',
      icon: '<i class="fas fa-eye fa-fw"></i>',
      callback: async () => await activity.sheet.render({ force: true }),
      condition: () => configurable,
    });
  }

  entries.push({
    name: 'TIDY5E.ContextMenuActionPinToAttributes',
    icon: `<i class="fa-solid fa-thumbtack"></i>`,
    callback: async () => await AttributePins.pin(activity, 'activity'),
    condition: () =>
      app.actor &&
      activity.item.isOwner &&
      !FoundryAdapter.isLockedInCompendium(activity.item) &&
      AttributePins.isPinnable(activity, 'activity') &&
      !AttributePins.isPinned(activity),
    group: 'pins',
  });

  entries.push({
    name: 'TIDY5E.ContextMenuActionUnpinFromAttributes',
    icon: `<i class="fa-solid fa-xmark" style='color: var(--t5e-warning-accent-color)'></i>`,
    callback: async () => await AttributePins.unpin(activity),
    condition: () =>
      activity.item.isOwner &&
      !FoundryAdapter.isLockedInCompendium(activity.item) &&
      AttributePins.isPinnable(activity, 'activity') &&
      AttributePins.isPinned(activity),
    group: 'pins',
  });

  if ('favorites' in (app.actor?.system ?? {})) {
    const uuid = `${activity.item.getRelativeUUID(app.actor)}.Activity.${
      activity.id
    }`;
    const isFavorited = app.actor.system.hasFavorite(uuid);
    entries.push({
      name: isFavorited ? 'DND5E.FavoriteRemove' : 'DND5E.Favorite',
      icon: '<i class="fas fa-bookmark fa-fw"></i>',
      condition: () =>
        activity.item.isOwner &&
        !FoundryAdapter.isLockedInCompendium(activity.item),
      callback: async () => {
        if (isFavorited) {
          await app.actor.system.removeFavorite(uuid);
        } else {
          await app.actor.system.addFavorite({ type: 'activity', id: uuid });
        }
      },
      group: 'state',
    });
  }

  return entries;
}
