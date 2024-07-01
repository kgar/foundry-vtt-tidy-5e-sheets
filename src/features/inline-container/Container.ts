import type {
  ContainerContents,
  ContainerItemContext,
  Item5e,
} from 'src/types/item.types';
import { Inventory } from '../sections/Inventory';
import type { SheetTabSectionConfigs } from '../sections/sections.types';

export class Container {
  static async getContainerContents(
    item: Item5e,
    sectionConfigs: SheetTabSectionConfigs
  ): Promise<ContainerContents> {
    const containerItems = item.system.contents.values();

    return {
      capacity: await item.system.computeCapacity(),
      currency: item.system.currency,
      contents: Inventory.getInventory(containerItems, sectionConfigs),
      itemContext: await Container.getContainerItemContexts(item),
    };
  }

  static async getContainerItemContexts(
    container: Item5e
  ): Promise<Record<string, ContainerItemContext>> {
    throw new Error(
      'TODO: Implement; recursively calls into getContainerContents for each nested container'
    );
  }
}
