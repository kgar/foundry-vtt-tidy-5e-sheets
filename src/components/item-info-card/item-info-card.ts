import type { Item5e } from 'src/types/item';
import DefaultItemCardContentTemplate from './DefaultItemCardContentTemplate.svelte';
import SpellbookItemCardContent from './SpellbookItemCardContent.svelte';
import InventoryItemCardContent from './InventoryItemCardContent.svelte';

export function getItemCardContentTemplate(item: Item5e) {
  // TODO: Make item type to Card Content Template mod-able via the API.
  switch (item?.type) {
    case 'spell':
      console.log('returning spell card', item?.type);
      return SpellbookItemCardContent;
    case 'backpack':
    case 'equipment':
    case 'consumable':
    case 'tool':
    case 'loot':
      console.log('returning item card', item?.type);
      return InventoryItemCardContent;
    case 'race':
    case 'background':
    case 'class':
    case 'subclass':
    case 'feat':
    default:
      console.log('returning default card', item?.type);
      return DefaultItemCardContentTemplate;
  }
}
