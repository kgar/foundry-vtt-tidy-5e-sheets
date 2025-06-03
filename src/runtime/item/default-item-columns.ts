import type { ColumnSpecification } from './item.types';
import ItemQuantityColumn from 'src/sheets/quadrone/item/columns/ItemQuantityColumn.svelte';
import InlineCapacityBarColumn from 'src/sheets/quadrone/item/columns/InlineCapacityBarColumn.svelte';
import ItemPriceColumn from 'src/sheets/quadrone/item/columns/ItemPriceColumn.svelte';
import ItemChargesColumn from 'src/sheets/quadrone/item/columns/ItemChargesColumn.svelte';
import ItemWeightColumn from 'src/sheets/quadrone/item/columns/ItemWeightColumn.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import InlineCapacityTrackerColumn from 'src/sheets/quadrone/item/columns/InlineCapacityTrackerColumn.svelte';
import ItemTimeColumn from 'src/sheets/quadrone/item/columns/ItemTimeColumn.svelte';

export const defaultItemColumns = {
  // Inline Container Capacity Bar
  inventoryContainerCapacityBar: {
    key: 'inventoryContainerCapacityBar',
    cellContent: {
      type: 'component',
      component: InlineCapacityBarColumn,
    },
    width: '7rem',
    cellClasses: 'text-cell',
    hideUnder: 400,
  },
  // Inline Container Capacity Tracker
  inventoryContainerCapacityTracker: {
    key: 'inventoryContainerCapacityTracker',
    cellContent: {
      type: 'component',
      component: InlineCapacityTrackerColumn,
    },
    width: '7rem',
    cellClasses: 'text-cell',
    hideUnder: 450,
  },
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
  time: {
    key: 'time',
    headerContent: {
      type: 'callback',
      callback: () => FoundryAdapter.localize('DND5E.SpellHeader.Time'),
    },
    cellContent: {
      type: 'component',
      component: ItemTimeColumn,
    },
    width: '5rem',
  },
} satisfies Record<string, ColumnSpecification>;
