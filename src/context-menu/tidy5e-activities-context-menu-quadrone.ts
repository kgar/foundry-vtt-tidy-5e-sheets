import type { Activity5e } from 'src/foundry/dnd5e.types';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { ContextMenuEntry } from 'src/foundry/foundry.types';

export function getContextMenuOptionsQuadrone(
  activity: Activity5e,
  app: any,
  configurable: boolean
): ContextMenuEntry[] {
  const isUnlockedForOwner =
    activity.item.isOwner &&
    !FoundryAdapter.isLockedInCompendium(activity.item);

  const entries: ContextMenuEntry[] = [];
  entries.push({
    name: 'DND5E.ContextMenuActionView',
    icon: '<i class="fas fa-eye fa-fw"></i>',
    callback: async () => await activity.sheet.render({ force: true }),
    condition: () => configurable && !isUnlockedForOwner,
    group: 'common',
  });

  entries.push({
    name: 'DND5E.ContextMenuActionEdit',
    icon: '<i class="fas fa-pen-to-square fa-fw"></i>',
    callback: async () => await activity.sheet.render({ force: true }),
    condition: () => configurable && isUnlockedForOwner,
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
    callback: async () => {
      const createData = activity.toObject();
      delete createData._id;
      await activity.item.createActivity(createData.type, createData, {
        renderSheet: false,
      });
    },
    condition: () => configurable && isUnlockedForOwner,
    group: 'common',
  });

  entries.push({
    name: 'DND5E.ContextMenuActionDelete',
    icon: '<i class="fas fa-trash fa-fw"></i>',
    callback: async () => await activity.deleteDialog(),
    condition: () => configurable && isUnlockedForOwner,
    group: 'be-careful',
  });

  return entries;
}
