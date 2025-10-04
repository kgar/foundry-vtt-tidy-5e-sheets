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
import { TidyHooks } from 'src/foundry/TidyHooks';
import type { ContainerCapacityContext } from 'src/types/types';
import TableRowActionsRuntime from 'src/runtime/tables/TableRowActionsRuntime.svelte';
import type { ContainerContentsRowActionsContext } from 'src/runtime/types';
import { isNil } from 'src/utils/data';
import { TidyFlags } from 'src/foundry/TidyFlags';

export class Container {
  static async getContainerContents(
    container: Item5e,
    context: ContainerContentsRowActionsContext
  ): Promise<ContainerContents> {
    const containerContentsInventory =
      await Inventory.getContainerContentsInventory(container, {
        rowActions:
          TableRowActionsRuntime.getContainerContentsRowActions(context),
      });

    return {
      capacity: await container.system.computeCapacity(),
      currency: container.system.currency,
      contents: containerContentsInventory,
      itemContext: await Container.getContainerItemContext(container, context),
    };
  }

  static async getContainerItemContext(
    container: Item5e,
    context: ContainerContentsRowActionsContext
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
        ctx.containerContents = await Container.getContainerContents(
          item,
          context
        );
      }

      ctx.activities = Activities.getVisibleActivities(
        item,
        item.system.activities
      )?.map(Activities.getActivityItemContext);
    }

    return itemContext;
  }

  static promptCreateInventoryItem(container: Item5e, customSection?: string) {
    const actor = container.actor;

    const folder = !!actor ? undefined : container.folder;

    const createData: Record<string, any> = {
      folder: folder,
      'system.container': container.id,
    };

    if (!isNil(customSection, '')) {
      createData[TidyFlags.section.prop] = customSection;
    }

    if (!TidyHooks.tidy5eSheetsPreCreateItem(actor, createData, game.user.id)) {
      return;
    }

    return Item.implementation.createDialog(createData, {
      parent: actor,
      pack: container.pack,
      types: Inventory.getInventoryTypes(),
      keepId: true,
    });
  }

  static createInventoryItem(container: Item5e, type: string) {
    const actor = container.actor;

    const folder = !!actor ? undefined : container.folder;

    const createData = {
      folder: folder,
      'system.container': container.id,
      type,
      name: game.i18n.format('DOCUMENT.New', {
        type: game.i18n.format(CONFIG.Item.typeLabels[type]),
      }),
    };

    if (!TidyHooks.tidy5eSheetsPreCreateItem(actor, createData, game.user.id)) {
      return;
    }

    return Item.implementation.create(createData, {
      parent: actor,
      pack: container.pack,
      keepId: true,
      renderSheet: true,
    });
  }

  static async computeCapacity(
    container: Item5e
  ): Promise<ContainerCapacityContext> {
    const context = await container.system.computeCapacity();

    context.units = container.system.capacity.count
      ? FoundryAdapter.localize('DND5E.Items')
      : container.system.capacity.weight.value
      ? CONFIG.DND5E.weightUnits[container.system.capacity.weight.units]
          ?.abbreviation ?? container.system.capacity.weight.units
      // TODO: someday deal with volume; currently, the system has no answer for volume tracking. You can set a max volume amount, but no items track how much volume they take up.
      : undefined;

    return context;
  }
}
