import type { ColumnSpecification } from './item.types';
import ItemQuantityColumn from 'src/sheets/quadrone/item/columns/ItemQuantityColumn.svelte';
import InlineCapacityBarColumn from 'src/sheets/quadrone/item/columns/InlineCapacityBarColumn.svelte';
import ItemPriceColumn from 'src/sheets/quadrone/item/columns/ItemPriceColumn.svelte';
import ItemChargesColumn from 'src/sheets/quadrone/item/columns/ItemChargesColumn.svelte';
import ItemWeightColumn from 'src/sheets/quadrone/item/columns/ItemWeightColumn.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import InlineCapacityTrackerColumn from 'src/sheets/quadrone/item/columns/InlineCapacityTrackerColumn.svelte';

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
  // Inline Container Capacity Tracker
  inventoryContainerCapacityTracker: {
    key: 'inventoryContainerCapacityTracker',
    cellContent: {
      type: 'component',
      component: InlineCapacityTrackerColumn,
    },
    width: '7rem',
    cellClasses: 'item-label text-cell',
    hideUnder: 450,
  },
  // Inline Container Capacity Bar
  inventoryContainerCapacityBar: {
    key: 'inventoryContainerCapacityBar',
    cellContent: {
      type: 'component',
      component: InlineCapacityBarColumn,
    },
    width: '7rem',
    cellClasses: 'item-label text-cell',
    hideUnder: 400,
  },
} satisfies Record<string, ColumnSpecification>;
