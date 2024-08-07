import type { ContainerContents, Item5e } from 'src/types/item.types';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { getContext } from 'svelte';
import { ItemFilterService } from '../filtering/ItemFilterService';
import { debug } from 'src/utils/logging';
import type { ActionItem } from 'src/types/types';

export class ItemVisibility {
  static countVisibleItems(items: Item5e[], itemIdsToShow?: Set<string>) {
    if (!itemIdsToShow) {
      return items.length;
    }

    return items.reduce(
      (prev, curr) => prev + (itemIdsToShow.has(curr.id) ? 1 : 0),
      0
    );
  }

  static getItemsToShowAtDepth(args: {
    tabId: string;
    criteria: string;
    sections: (
      | { items: Item5e[] }
      | { spells: Item5e[] }
      | { actions: ActionItem[] }
    )[];
    itemContext: Record<string, { containerContents?: ContainerContents }>;
  }) {
    const itemFilterService = getContext<ItemFilterService | undefined>(
      'itemFilterService'
    );

    // TODO: Have composed store always ready to use
    const filter = itemFilterService?.compose(args.tabId) ?? (() => true);

    // Is there a better way to do this? We are iterating over these items quite a lot.
    const items = args.sections.flatMap((x) =>
      'items' in x
        ? x.items
        : 'spells' in x
        ? x.spells
        : x.actions.map((y) => y.item)
    );

    const results = new Set(
      ItemVisibility.recursivelyFindEligibleItems({
        criteria: args.criteria,
        filter: filter,
        itemContext: args.itemContext,
        items: items,
      })
    );

    debug('Item IDs to show', { results, ...args });

    return results;
  }

  private static recursivelyFindEligibleItems(args: {
    criteria: string;
    filter: (item: Item5e) => boolean;
    items: Item5e[];
    itemContext: Record<string, { containerContents?: ContainerContents }>;
  }): string[] {
    let results: string[] = [];

    for (let item of args.items) {
      const containerContents = args.itemContext[item.id]?.containerContents;
      let containedItemsToInclude: string[] = [];
      if (containerContents) {
        containedItemsToInclude = ItemVisibility.recursivelyFindEligibleItems({
          criteria: args.criteria,
          filter: args.filter,
          itemContext: containerContents.itemContext,
          items: containerContents.contents.flatMap((s) => s.items),
        });

        results = results.concat(containedItemsToInclude);
      }

      const includeItem =
        (FoundryAdapter.searchItem(item, args.criteria) && args.filter(item)) ||
        !!containedItemsToInclude.length;
      if (includeItem) {
        results.push(item.id);
      }
    }

    return results;
  }
}
