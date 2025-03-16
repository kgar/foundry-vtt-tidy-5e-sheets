import type { ColumnSpecification } from 'src/types/types';
import ItemQuantityColumn from 'src/sheets/quadrone/item/columns/ItemQuantityColumn.svelte';
import InlineCapacityColumn from 'src/sheets/quadrone/item/columns/InlineCapacityColumn.svelte';
import ItemPriceColumn from 'src/sheets/quadrone/item/columns/ItemPriceColumn.svelte';
import ItemChargesColumn from 'src/sheets/quadrone/item/columns/ItemChargesColumn.svelte';
import ItemWeightColumn from 'src/sheets/quadrone/item/columns/ItemWeightColumn.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';

export const defaultItemColumns = {
  // Charges
  inventoryCharges: {
    key: 'inventoryCharges',
    headerContent: {
      type: 'callback',
      callback: () => FoundryAdapter.localize('DND5E.Charges'),
    },
    cellContent: {
      type: 'component',
      component: ItemChargesColumn,
    },
    hideUnder: 400,
    width: '5rem',
    cellClasses: 'inline-uses',
  },
  // Price
  inventoryPrice: {
    key: 'inventoryPrice',
    headerContent: {
      type: 'callback',
      callback: () => FoundryAdapter.localize('DND5E.Price'),
    },
    cellContent: {
      type: 'component',
      component: ItemPriceColumn,
    },
    hideUnder: 550,
    width: '5.5rem',
  },
  // Quantity
  inventoryQuantity: {
    key: 'inventoryQuantity',
    headerContent: {
      type: 'callback',
      callback: () => FoundryAdapter.localize('DND5E.Quantity'),
    },
    cellContent: {
      type: 'component',
      component: ItemQuantityColumn,
    },
    width: '5rem',
  },
  // Weight
  inventoryWeight: {
    key: 'inventoryWeight',
    headerContent: {
      type: 'callback',
      callback: () => FoundryAdapter.localize('DND5E.Weight'),
    },
    cellContent: {
      type: 'component',
      component: ItemWeightColumn,
    },
    hideUnder: 500,
    width: '5rem',
  },
  // Inline Container Capacity
  inventoryContainerCapacity: {
    key: 'inventoryContainerCapacity',
    headerContent: {
      type: 'callback',
      callback: () =>
        FoundryAdapter.localize('DND5E.CONTAINER.FIELDS.capacity.label'),
    },
    cellContent: {
      type: 'component',
      component: InlineCapacityColumn,
    },
    width: '10rem',
    cellClasses: 'item-label text-cell',
    hideUnder: 400,
  },
} satisfies Record<string, ColumnSpecification>;
