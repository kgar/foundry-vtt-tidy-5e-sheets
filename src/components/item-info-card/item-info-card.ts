import type { Item5e } from 'src/types/item.types';
import DefaultItemCardContentTemplate from './DefaultItemCardContentTemplate.svelte';
import SpellbookItemCardContent from './SpellbookItemCardContent.svelte';
import InventoryItemCardContent from './InventoryItemCardContent.svelte';
import { Inventory } from 'src/features/sections/Inventory';

export function getItemCardContentTemplate(item: Item5e) {
  // TODO: Make item type to Card Content Template mod-able via the API.
  const intentoryItems = new Set(Inventory.inventoryItemTypes);

  if (intentoryItems.has(item?.type)) {
    return InventoryItemCardContent;
  }

  switch (item?.type) {
    case 'spell':
      return SpellbookItemCardContent;
    case 'race':
    case 'background':
    case 'class':
    case 'subclass':
    case 'feat':
    default:
      return DefaultItemCardContentTemplate;
  }
}
