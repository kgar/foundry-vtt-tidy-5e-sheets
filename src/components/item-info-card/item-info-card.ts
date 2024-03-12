import type { Item5e } from 'src/types/item.types';
import DefaultItemCardContentTemplate from './DefaultItemCardContentTemplate.svelte';
import SpellbookItemCardContent from './SpellbookItemCardContent.svelte';
import InventoryItemCardContent from './InventoryItemCardContent.svelte';

export function getItemCardContentTemplate(item: Item5e) {
  // TODO: Make item type to Card Content Template mod-able via the API.
  switch (item?.type) {
    case 'spell':
      return SpellbookItemCardContent;
    case 'equipment':
    case 'consumable':
    case 'container':
    case 'tool':
    case 'loot':
      return InventoryItemCardContent;
    case 'race':
    case 'background':
    case 'class':
    case 'subclass':
    case 'feat':
    default:
      return DefaultItemCardContentTemplate;
  }
}
