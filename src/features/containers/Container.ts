import type {
  ContainerContents,
  ContainerItemContext,
  Item5e,
} from 'src/types/item.types';
import { Inventory } from '../sections/Inventory';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { CONSTANTS } from 'src/constants';
import type { CharacterFavorite } from 'src/foundry/dnd5e.types';
import { Activities } from '../activities/activities';

export class Container {
  static async getContainerContents(item: Item5e): Promise<ContainerContents> {
    const containerItems = (await item.system.contents).values();

    return {
      capacity: await item.system.computeCapacity(),
      currency: item.system.currency,
      contents: Inventory.getInventory(containerItems),
      itemContext: await Container.getContainerItemContext(item),
    };
  }

  static async getContainerItemContext(
    container: Item5e
  ): Promise<Record<string, ContainerItemContext>> {
    const itemContext: Record<string, ContainerItemContext> = {};

    const favorites: CharacterFavorite[] | undefined =
      container.actor?.system.favorites;

    const containerValues = (await container.system.contents).values();

    for (const item of containerValues) {
      const ctx = (itemContext[item.id] ??= {});
      ctx.totalWeight = (await item.system.totalWeight).toNearest(0.1);
      ctx.isStack = item.system.quantity > 1;
      ctx.attunement = FoundryAdapter.getAttunementContext(item);

      if (favorites) {
        const relativeUuid = item.getRelativeUUID(container.actor);
        // TODO: Determine if this looped array traversal is going to be an issue; if so, consider passing in a context object with a favorites map.
        ctx.favoriteId = item.actor.system.favorites?.find(
          (f: CharacterFavorite) => f.id === relativeUuid
        )?.id;
      }

      if (item.type === CONSTANTS.ITEM_TYPE_CONTAINER) {
        ctx.containerContents = await Container.getContainerContents(item);
      }

      ctx.activities = Activities.getVisibleActivities(
        item,
        item.system.activities
      )?.map(Activities.getActivityItemContext);
    }

    return itemContext;
  }
}
